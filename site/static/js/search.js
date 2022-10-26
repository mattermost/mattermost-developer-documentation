'use strict';
// Based on a vanilla JS version of https://gist.github.com/sebz/efddfc8fdcb6b480f567

/**
 * @typedef SearchIndexPage
 * @type {object}
 * @property {string} permalink The permanent URL to the document
 * @property {string} title The document title
 * @property {string} tags List of document tags
 * @property {string} categories List of document categories
 * @property {string} contents The raw text contents of the document
 */

/**
 * @typedef SearchResult
 * @type {object}
 * @property {number} score The result score
 * @property {SearchIndexPage} page The metadata of the result document
 */

/**
 * A class implementing simple text search using lunr.js
 */
class LunrSearch {
    /** @type {lunr.Index|null} */
    lunrIndex = null;
    /** @type {Array<SearchIndexPage>} */
    pagesIndex = [];
    /** A query to be executed at a later time */
    deferredQuery = "";

    /**
     * Build a Lunr index using the supplied document data
     * @static
     * @param {Array<SearchIndexPage>} data
     * @returns {lunr.Index}
     */
    static buildIndex(data) {
        return lunr((builder) => {
            // Note that each of the fields referenced below also exists in the SearchIndexPage object
            builder.field('title');
            builder.field('tags');
            builder.field('categories');
            builder.field('contents');
            builder.ref('permalink');
            for (const page of data) {
                builder.add(page);
            }
        });
    }

    constructor() {
        // Initialize ourselves after the page has loaded
        document.addEventListener("DOMContentLoaded", () => {
            this.initUI();
            this.initLunrV2();
        });
        // Look for a query parameter and execute the search if the index is loaded
        this.checkLocationQuery();
    }

    initLunrV2() {
        fetch('searchindex/index.json')
            .then((response) => response.json())
            .then((data) => {
                this.setIndexPages(data);
                this.setIndex(LunrSearch.buildIndex(data));
                this.checkDeferredQuery();
            });
    }

    /**
     * Hook up an event handler on the button
     */
    initUI() {
        const searchFunc = () => {
            const self = this;
            self.doManualSearch();
        };
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", searchFunc);
    }

    setIndexPages(pages) {
        this.pagesIndex = pages;
    }

    setIndex(index) {
        this.lunrIndex = index;
    }

    isIndexLoaded() {
        return this.lunrIndex !== null;
    }

    checkLocationQuery() {
        const location = new URL(window.location.href);
        if (location.searchParams.has("q")) {
            const queryParam = location.searchParams.get("q").trim();
            if (queryParam !== "") {
                // Put the query into the input field
                const $search = document.getElementById("search");
                $search.value = queryParam;
                // Execute the search if the index is loaded, otherwise defer the search
                if (this.isIndexLoaded()) {
                    this.doManualSearch();
                } else {
                    this.deferredQuery = queryParam;
                }
            }
        }
    }

    checkDeferredQuery() {
        // If there is a deferred query, execute the search
        if (this.deferredQuery !== "") {
            const $search = document.getElementById("search");
            $search.value = this.deferredQuery;
            this.doManualSearch();
            this.deferredQuery = "";
        }
    }

    clearResults() {
        const $results = document.getElementById("results");
        if ($results.hasChildNodes()) {
            while ($results.firstChild) {
                $results.removeChild($results.firstChild);
            }
        }
    }

    doManualSearch() {
        // If there is no index, we don't want to search
        if (!this.isIndexLoaded()) {
            console.error("search index has not been loaded; unable to search");
            return;
        }
        // Only trigger a search when 2 chars. at least have been provided
        const $search = document.getElementById("search");
        const query = $search.value;
        if (query.length < 2) {
            console.error("query must be at least 2 characters in length");
            return;
        }
        // Clear the existing search results
        this.clearResults();
        // add some fuzzyness to the string matching to help with spelling mistakes.
        const fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
        const fuzzyQuery = query + '~' + fuzzLength;
        // Perform the search and display the results
        const results = this.search(fuzzyQuery);
        console.log("doManualSearch(): search returned " + results.length + " results");
        this.renderResults(results);
    }

    /**
     * Trigger a search in lunr and transform the result
     *
     * @param  {string} query The search query
     * @return {Array<SearchResult>} The results of the search
     */
    search(query) {
        // Find the item in our index corresponding to the lunr one to have more info
        // Lunr result:
        //  {ref: "/section/page1", score: 0.2725657778206127}
        // Our result:
        //  {title:"Page1", permalink:"/section/page1", ...}
        const rawResults = this.lunrIndex.search(query);
        return rawResults.map((result) => {
            const pageRef = this.pagesIndex.filter((indexPage) => indexPage.permalink === result.ref);
            if (pageRef.length > 1) {
                console.log("*** search(): ref " + result.ref + " matches multiple pages: " + JSON.stringify(pageRef));
            }
            return {
                score: result.score,
                page: pageRef[0]
            };
        })
    }

    /**
     * Display the first 50 results
     *
     * @param {Array<SearchResult>} results the search results to display
     */
    renderResults(results) {
        if (!results.length) {
            console.error("renderResults(): no results specified");
            return;
        }
        // Only show the first fifty results
        const $results = document.getElementById("results");
        results.slice(0, 50).forEach((result) => {
            if (result.page && result.page.title && result.page.title !== "") {
                const li = document.createElement('li');
                const ahref = document.createElement('a');
                ahref.href = result.page.permalink;
                ahref.text = "» " + result.page.title;
                li.append(ahref);
                li.append(document.createElement("br"));
                const descSpan = document.createElement('span');
                descSpan.textContent = "[" + result.score + "] " + result.page.contents.substring(0, 64) + "...";
                li.append(descSpan);
                $results.appendChild(li);
            }
        });
    }

}

// Let's get started
new LunrSearch();
