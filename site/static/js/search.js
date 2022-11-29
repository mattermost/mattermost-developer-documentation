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
 * @property {string} section The name of the site section that the document lives in
 * @property {string|null} subsection The name of the document subsection, if defined
 */

/**
 * @typedef SearchResult
 * @type {object}
 * @property {number} score The result score
 * @property {SearchIndexPage} page The metadata of the result document
 * @property {Record<string, any>} matchData Result match metadata
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
            builder.field('title', {boost: 0.5});
            builder.field('tags', {boost: 0.5});
            builder.field('categories', {boost: 0.5});
            builder.field('contents', {boost: 1});
            builder.field('section', {boost: 0.5});
            builder.field('subsection', {boost: 1});
            for (const page of data) {
                // Skip this record if there is no title
                if ("title" in page && page["title"] === "") {
                    continue;
                }
                // Check if there is contents; skip the record if there isn't
                if (!("contents" in page)) {
                    continue;
                }
                if (page["contents"] === "") {
                    continue;
                }
                // Add the page to the lunr search index
                builder.add(page);
            }
        });
    }

    /**
     * Capitalizes the first letter of the string
     * @param {string} str The string to operate on
     * @returns {string} The input string with the first letter capitalized
     */
    static capitalizeFirstLetter(str) {
        if (str.length === 0) {
            return str;
        }
        if (str.length === 1) {
            return str.toUpperCase();
        }
        return str.substring(0, 1).toUpperCase() + str.substring(1);
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
        // Optional: add some fuzzyness to the string matching to help with spelling mistakes.
        // const fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
        // const fuzzyQuery = query + '~' + fuzzLength;
        // Perform the search and display the results
        const results = this.lunrSearch(query);
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
        //  {ref: "/section/page1", score: 0.2725657778206127, matchData: {}}
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
                    page: pageRef[0],
                    matchData: result.matchData,
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
                const listItemEl = document.createElement('li');
                // Results have:
                // A link "section", which contains:
                const linkDiv = document.createElement('div');
                linkDiv.classList.add("search__results_result-link-div");
                // 1) A link to the page associated with the result
                const ahref = document.createElement('a');
                ahref.href = result.page.permalink;
                ahref.text = result.page.title;
                ahref.classList.add("search__results_result-link");
                // 2) The section and subsection of the result page
                let sectText = LunrSearch.capitalizeFirstLetter(result.page.section);
                if (result.page.subsection) {
                    sectText += " > " + LunrSearch.capitalizeFirstLetter(result.page.subsection);
                }
                const sectPara = document.createElement('p');
                sectPara.textContent = "(" + sectText + ")";
                sectPara.classList.add("search__results_result-section");
                linkDiv.append(ahref, sectPara);
                listItemEl.appendChild(linkDiv);
                // A description of the page associated with the result; uses the first 240 characters
                let descText = result.page.contents.substring(0, 240);
                if (result.page.contents.length > 240) {
                    descText += "...";
                }
                const descPara = document.createElement('p');
                descPara.textContent = descText;
                descPara.classList.add("search__results_result-description");
                listItemEl.append(descPara);
                // Highlight keyword matches in the page description
                if (result.matchData && "metadata" in result.matchData) {
                    const keywords = Object.keys(result.matchData.metadata);
                    if (keywords.length > 0) {
                        const mark = new Mark(descPara);
                        for (const keyword of keywords) {
                            mark.mark(keyword);
                        }
                    }
                }
                // Display the score and match data for debugging
                const scoreSpan = document.createElement('span');
                scoreSpan.textContent = String(result.score) + " " + JSON.stringify(result.matchData.metadata);
                listItemEl.append(scoreSpan);
                // Append the result to the end of the results list
                resultsEl.appendChild(listItemEl);
            }
        });
    }

}

// Let's get started
new LunrSearch();
