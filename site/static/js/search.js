'use strict';
//vanilla js version of https://gist.github.com/sebz/efddfc8fdcb6b480f567

var lunrIndex,
    $results,
    pagesIndex;

// Initialize lunrjs using our generated index file
function initLunr() {
    const request = new XMLHttpRequest();
    request.open('GET', 'searchindex/index.json', true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log("fetched search index.");
            pagesIndex = JSON.parse(request.responseText);
            console.log("start parsing index");
            lunrIndex = lunr((builder) => {
                builder.field('title');
                builder.field('tags');
                builder.field('categories');
                builder.field('contents');
                builder.ref('permalink');
                for (const rec of pagesIndex) {
                    builder.add(rec);
                }
            });
            console.log("finished parsing index.");
        } else {
            const err = textStatus + ", " + error;
            console.error("Error getting search index file:", err);
        }
    };
    console.log("fetching search index");
    request.send();
}

// Nothing crazy here, just hook up a event handler on the input field
function initUI() {
    console.log("initUI()");
    $results = document.getElementById("results");
    const $search = document.getElementById("search");
    $search.onkeyup = function () {
        while ($results.firstChild) {
            $results.removeChild($results.firstChild);
        }

        // Only trigger a search when 2 chars. at least have been provided
        const query = $search.value;
        if (query.length < 2) {
            return;
        }

        // add some fuzzyness to the string matching to help with spelling mistakes.
        const fuzzLength = Math.round(Math.min(Math.max(query.length / 4, 1), 3));
        const fuzzyQuery = query + '~' + fuzzLength;

        const results = search(fuzzyQuery);
        renderResults(results);
    };
}

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
function search(query) {
    // Find the item in our index corresponding to the lunr one to have more info
    // Lunr result:
    //  {ref: "/section/page1", score: 0.2725657778206127}
    // Our result:
    //  {title:"Page1", href:"/section/page1", ...}
    return lunrIndex.search(query).map(function (result) {
        const pageResult = pagesIndex.filter(function (page) {
            return page.permalink === result.ref;
        })[0];
        return {
            score: result.score,
            page: pageResult
        };
    });
}

/**
 * Display the 10 first results
 *
 * @param  {Array} results to display
 */
function renderResults(results) {
    if (!results.length) {
        return;
    }

    // Only show the first fifty results
    $results = document.getElementById("results");
    results.slice(0, 50).forEach(function (result) {
        if (result.page.title && result.page.title !== "") {
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

// Let's get started
initLunr();

document.addEventListener("DOMContentLoaded", function () {
    initUI();
})
