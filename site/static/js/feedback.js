'use strict';

// Init GTM dataLayer for Analytics
let eventValue = 0;
let rating = '';

/** Add click handlers to each of the emoji buttons */
const addEmojiClick = () => {
    const emojis = document.getElementsByClassName("rate-this-page-action");
    for (const emojiEl of emojis) {
        emojiEl.addEventListener('click', (e) => {
            emojiEl.classList.add("selected");

            // Prepare DataLayer Vars
            rating = emojiEl.getAttribute("data-rating");
            if (rating !== null) {
                switch (rating) {
                    case 'Yes':
                        eventValue = 3;
                        break;
                    case 'Somewhat':
                        eventValue = 2;
                        break;
                    case 'No':
                        eventValue = 1;
                        break;
                }
            }

            // Submit rating to Google Analytics
            submitRating();
        });
    }
};

/** Submit rating data to Google Analytics and show confirmation */
const submitRating = () => {
    if (eventValue > 0) {
        // Submit DataLayer Event to Google Analytics
        const dataLayer = window.dataLayer || [];
        dataLayer.push({
            event: 'rateThisPage',
            eventLabel: rating,
            eventValue: eventValue
        });

        // Reset emoji states and show confirmation
        resetEmojiStates();
        eventValue = 0;
        showConfirmationPopup();
        setTimeout(() => {
            hideConfirmationPopup();
        }, 3000);
    }
};

/** Reset the state of the emoji buttons to default */
const resetEmojiStates = () => {
    const emojis = document.getElementsByClassName("rate-this-page-action");
    for (const emojiEl of emojis) {
        emojiEl.classList.remove("selected");
    }
};

/** Hide the confirmation popup */
const hideConfirmationPopup = () => {
    const confirmationEls = document.getElementsByClassName("c-thermometer-popup");
    if (confirmationEls.length > 0) {
        confirmationEls[0].classList.replace("show", "hide");
    }
};

/** Show the confirmation popup */
const showConfirmationPopup = () => {
    const confirmationEls = document.getElementsByClassName("c-thermometer-popup");
    if (confirmationEls.length > 0) {
        confirmationEls[0].classList.replace("hide", "show");
    }
};

/** Add a document click handler to hide any visible confirmation popups */
const addDocumentClick = () => {
    document.addEventListener('click', (e) => {
        // Don't hide popup if clicking on emoji buttons
        if (!e.target.closest('.rate-this-page-action') && !e.target.closest('.c-thermometer-popup')) {
            hideConfirmationPopup();
            resetEmojiStates();
        }
    });
    // Also hide visible popups if the user presses the Escape key
    document.addEventListener('keyup', (e) => {
        if (e.key === "Escape") {
            hideConfirmationPopup();
            resetEmojiStates();
        }
    });
};

/** Stop the propagation of click events for particular divs */
const addEventPropagationHandlers = () => {
    const modalTriggerEls = document.getElementsByClassName("c-thermometer__trigger");
    if (modalTriggerEls.length > 0) {
        modalTriggerEls[0].addEventListener('click', e => e.stopImmediatePropagation());
    }
    const popupEls = document.getElementsByClassName("c-thermometer__popup");
    if (popupEls.length > 0) {
        popupEls[0].addEventListener('click', e => e.stopImmediatePropagation());
    }
};

// Initialize the feedback widget when the document has finished loading
document.addEventListener("DOMContentLoaded", (event) => {
    addEventPropagationHandlers();
    addEmojiClick();
    addDocumentClick();
});
