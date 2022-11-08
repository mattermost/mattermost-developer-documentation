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
            builder.ref('permalink');
            builder.field('title', {boost: 1}); // Boost score for matches on the title by 1
            builder.field('tags', {boost: 2}); // Boost score for matches on tags by 2
            builder.field('categories', {boost: 0}); // Don't boost score for matches on categories
            builder.field('contents', {boost: 0.5}); // Boost score for matches on content by 0.5
            for (const page of data) {
                // Skip this record if there is no title
                if ("title" in page && page["title"] === "") {
                    continue;
                }
                // Check if there is contents; warn if there isn't
                if (!("contents" in page)) {
                    console.error(`buildIndex(): missing 'contents' key in index record; page=${JSON.stringify(page)}`);
                }
                if (page["contents"] === "") {
                    console.error(`buildIndex(): empty 'contents' in index record; page=${JSON.stringify(page)}`);
                }
                // Add the page to the lunr search index
                builder.add(page);
            }
        });
    }

    constructor() {
        // Initialize ourselves after the page has loaded
        document.addEventListener("DOMContentLoaded", () => {
            this.getSearchData();
            this.initUI();
        });
        // Look for a query parameter and execute the search if the index is loaded
        this.checkLocationQuery();
    }

    getSearchData() {
        this.updateStatus("Loading...");
        fetch('searchindex/index.json')
            .then((response) => response.json())
            .then((data) => {
                this.setIndexPages(data);
                this.updateStatus("Building index...");
                this.setIndex(LunrSearch.buildIndex(data));
                this.updateStatus("");
                this.checkDeferredQuery();
            });
    }

    /**
     * Hook up an event handler on the button
     */
    initUI() {
        const searchButton = document.getElementById("search-button");
        searchButton.addEventListener("click", (event) => {
            this.search();
        });
        const searchInput = document.getElementById("search-query");
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.search();
            }
        });
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
                const searchEl = document.getElementById("search-query");
                searchEl.value = queryParam;
                // Execute the search if the index is loaded, otherwise defer the search
                if (this.isIndexLoaded()) {
                    this.search();
                } else {
                    this.deferredQuery = queryParam;
                }
            }
        }
    }

    checkDeferredQuery() {
        // If there is a deferred query, execute the search
        if (this.deferredQuery !== "") {
            const searchEl = document.getElementById("search-query");
            searchEl.value = this.deferredQuery;
            this.search();
            this.deferredQuery = "";
        } else {
            this.updateStatus("");
        }
    }

    clearResults() {
        const resultsEl = document.getElementById("results");
        if (resultsEl.hasChildNodes()) {
            while (resultsEl.firstChild) {
                resultsEl.removeChild(resultsEl.firstChild);
            }
        }
    }

    updateStatus(message) {
        const statusEl = document.getElementById("search-status");
        statusEl.innerText = message;
    }

    updateResultCount(numberOfResults) {
        const resultCountEl = document.getElementById("search-result-count");
        let countText = "Search finished, no pages match the search query.";
        if (numberOfResults > 0) {
            countText = `Search finished, found ${numberOfResults} page(s) matching the search query. Results are sorted by relevance.`;
        }
        resultCountEl.innerText = countText;
    }

    search() {
        // If there is no index, we don't want to search
        if (!this.isIndexLoaded()) {
            console.error("search(): search index has not been loaded; unable to search");
            return;
        }
        // Only trigger a search when 2 chars. at least have been provided
        const searchEl = document.getElementById("search-query");
        const query = searchEl.value;
        if (query.length < 2) {
            console.error("search(): query must be at least 2 characters in length");
            return;
        }
        // Clear the existing search results
        this.clearResults();
        // Update the status
        this.updateStatus("Searching...");
        // add some fuzzyness to the string matching to help with spelling mistakes.
        const fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
        const fuzzyQuery = query + '~' + fuzzLength;
        // Perform the search and display the results
        const results = this.lunrSearch(fuzzyQuery);
        this.updateResultCount(results.length);
        this.renderResults(results);
        this.updateStatus("");
    }

    /**
     * Trigger a search in lunr and transform the result
     *
     * @param  {string} query The search query
     * @return {Array<SearchResult>} The results of the search
     */
    lunrSearch(query) {
        // Find the item in our index corresponding to the lunr one to have more info
        // Lunr result:
        //  {ref: "/section/page1", score: 0.2725657778206127}
        // Our result:
        //  {title:"Page1", permalink:"/section/page1", ...}
        return this.lunrIndex
            .search(query)
            .map((result) => {
                const pageRef = this.pagesIndex.filter(
                    (indexPage) => indexPage.permalink === result.ref
                );
                if (pageRef.length > 1) {
                    // If a permalink, for some reason, matches more than one page then we should know about it somehow
                    console.error(
                        "lunrSearch(): ref " + result.ref + " matches multiple pages: " + JSON.stringify(pageRef)
                    );
                }
                return {
                    score: result.score,
                    page: pageRef[0]
                };
            });
    }

    /**
     * Display the results
     *
     * @param {Array<SearchResult>} results the search results to display
     */
    renderResults(results) {
        if (!results.length) {
            return;
        }
        // Only show the first fifty results
        const resultsEl = document.getElementById("results");
        results.forEach((result) => {
            if (result.page && result.page.title && result.page.title !== "") {
                // Each result is a <li>
                const li = document.createElement('li');
                // Results have:
                // A link to the page associated with the result
                const ahref = document.createElement('a');
                ahref.href = result.page.permalink;
                ahref.text = result.page.title;
                ahref.classList.add("search__results_result-link");
                li.append(ahref);
                // A description of the page associated with the result; uses the first 240 characters
                const descSpan = document.createElement('span');
                descSpan.textContent = result.page.contents.substring(0, 240) + "...";
                descSpan.classList.add("search__results_result-description");
                li.append(descSpan);
                // Append the result to the end of the results list
                resultsEl.appendChild(li);
            }
        });
    }

}

// Let's get started
new LunrSearch();
