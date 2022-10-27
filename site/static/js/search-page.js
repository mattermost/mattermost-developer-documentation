'use strict';
/**
 * Get the search terms from the input field and redirect the user to the search page
 */
const performSearch = () => {
    const searchQuery = document.getElementById("search-query");
    if (searchQuery) {
        const redirectURL = new URL("search/", BASE_URL);
        redirectURL.searchParams.set("q", searchQuery.value);
        window.location.href = redirectURL.toString();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    // Hook up the search button with the performSearch method
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", performSearch);
    }
    // Hook up the input field with the performSearch method
    const searchInput = document.getElementById("search-query");
    if (searchInput) {
        searchInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                performSearch();
            }
        });
    }
});
