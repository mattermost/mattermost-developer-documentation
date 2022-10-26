'use strict';
/**
 * Get the search terms from the input field and redirect the user to the search page
 */
const performSearch = () => {
    const searchQuery = document.getElementById("search-query");
    const redirectURL = new URL(window.location.pathname + "search/", window.location.origin);
    redirectURL.searchParams.set("q", searchQuery.value);
    console.log("performSearch(): redirectURL=" + redirectURL.toString());
    window.location.href = redirectURL.toString();
};

document.addEventListener("DOMContentLoaded", () => {
    // Hook up the search button with the performSearch method
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", performSearch);
    // Hook up the input field with the performSearch method
    const searchInput = document.getElementById("search-query");
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
});
