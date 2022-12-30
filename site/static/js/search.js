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
    /**
     * The Lunr search index
     * @type {lunr.Index|null}
     */
    lunrIndex = null;
    /**
     * An array of search index data generated by Hugo
     * @type {Array<SearchIndexPage>}
     */
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
     * @static
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

    /**
     * Load the search index data and generate a new Lunr index from it
     */
    getSearchData() {
        this.updateStatus("Loading...");
        fetch('searchindex/index.json')
            .catch((e) => {
                console.error(e);
                this.updateStatus("");
            })
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
     * Hook up an event handler on the input field
     */
    initUI() {
        const searchInput = document.getElementById("search-query");
        if (searchInput) {
            // If we already added an event listener to the search input field via `search-page.js`, remove it
            if (performSidebarSearch) {
                searchInput.removeEventListener("keyup", performSidebarSearch);
            }
            searchInput.addEventListener("keyup", this.searchInputWasSubmitted);
        }
    }

    /**
     * Perform a search if the `Enter` key was pressed
     * @param {KeyboardEvent} event The KeyboardEvent associated with the search event
     */
    searchInputWasSubmitted(event) {
        if (event.key === "Enter") {
            this.search();
        }
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

    /**
     * Check the current location URL for a query parameter named `q` and search if it exists and is non-empty
     */
    checkLocationQuery() {
        const location = new URL(window.location.href);
        if (location.searchParams.has("q")) {
            const queryParam = location.searchParams.get("q").trim();
            if (queryParam !== "") {
                // Put the query into the input field
                const searchEl = document.getElementById("search-query");
                if (searchEl) {
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
    }

    /**
     * Check if a deferred query exists and run it
     */
    checkDeferredQuery() {
        // If there is a deferred query, execute the search
        if (this.deferredQuery !== "") {
            const searchEl = document.getElementById("search-query");
            if (searchEl) {
                searchEl.value = this.deferredQuery;
                this.search();
                this.deferredQuery = "";
            }
            return;
        }
        this.updateStatus("");
    }

    /**
     * Clear existing search results
     */
    clearResults() {
        const resultsEl = document.getElementById("results");
        if (resultsEl && resultsEl.hasChildNodes()) {
            while (resultsEl.firstChild) {
                resultsEl.removeChild(resultsEl.firstChild);
            }
        }
    }

    /**
     * Update the search status badge with a message
     * @param {string} message The message to display as the search status
     */
    updateStatus(message) {
        const statusEl = document.getElementById("search-status");
        if (statusEl) {
            statusEl.innerText = message;
        }
    }

    /**
     * Display a search summary based on the specified number of search results
     * @param {number} numberOfResults The number of results from a search
     */
    updateResultCount(numberOfResults) {
        const resultCountEl = document.getElementById("search-result-count");
        if (resultCountEl) {
            let countText = "Search finished, no pages match the search query.";
            if (numberOfResults > 0) {
                countText = `Search finished, found ${numberOfResults} page(s) matching the search query. Results are sorted by relevance.`;
            }
            resultCountEl.innerText = countText;
        }
    }

    /**
     * Ensure an index exists and a query longer than 1 character exists, then perform a search
     */
    search() {
        // If there is no index, we don't want to search
        if (!this.isIndexLoaded()) {
            console.error("search(): search index has not been loaded; unable to search");
            return;
        }
        let query = "";
        const searchEl = document.getElementById("search-query");
        if (searchEl) {
            query = searchEl.value;
        }
        // Only trigger a search when 2 chars. at least have been provided
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
        this.renderResults(results, this.parseSearchTerms(query));
        this.updateStatus("");
    }

    /**
     * Trigger a search in lunr and transform the result
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
     * Use Lunr to parse a query string into a list of search terms that can be used to highlight search results
     * @param {string} query The query string to parse
     * @returns {Array<string>} An array of search terms
     */
    parseSearchTerms(query) {
        // Create a new Lunr query object
        /** @type {lunr.Query} */
        const q = new lunr.Query(this.lunrIndex.fields);
        // Create a new lunr query parser using the query object above
        /** @type {lunr.QueryParser} */
        const p = new lunr.QueryParser(query, q);
        // Parse the query string into clauses
        p.parse();
        // Return the `term` field from each clause
        return q.clauses.map((clause) => { return clause.term; });
    }

    /**
     * Display the search results and highlight keywords in the results
     * @param {Array<SearchResult>} results the search results to display
     * @param {Array<string>} searchTerms An array of search terms used to highlight search results
     */
    renderResults(results, searchTerms) {
        if (!results.length) {
            return;
        }
        // Only show the first fifty results
        const resultsEl = document.getElementById("results");
        // If we can't find the `results` element, then there's nothing to do
        if (!resultsEl) {
            return;
        }
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
                const sectSpan = document.createElement('span');
                sectSpan.textContent = "(" + sectText + ")";
                sectSpan.classList.add("search__results_result-section");
                linkDiv.append(ahref, sectSpan);
                listItemEl.appendChild(linkDiv);
                // A description of the page associated with the result; uses the first 240 characters
                let descText = result.page.contents.substring(0, 240);
                if (result.page.contents.length > 240) {
                    descText += "...";
                }
                const descSpan = document.createElement('span');
                descSpan.textContent = descText;
                descSpan.classList.add("search__results_result-description");
                listItemEl.append(descSpan);
                // Highlight keyword matches in the page description
                const mark = new Mark(descSpan);
                for (const searchTerm of searchTerms) {
                    if (searchTerm.length > 1) {
                        mark.mark(searchTerm);
                    }
                }
                // Display the score and match data for debugging
                // const scoreSpan = document.createElement('span');
                // scoreSpan.textContent = "score: " + String(result.score);
                // scoreSpan.classList.add("search__results_result-debug");
                // listItemEl.append(
                //     document.createElement('br'),
                //     scoreSpan,
                // );
                // Append the result to the end of the results list
                resultsEl.appendChild(listItemEl);
            }
        });
    }

}

// Let's get started
new LunrSearch();
