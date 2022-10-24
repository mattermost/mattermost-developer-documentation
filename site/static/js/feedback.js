'use strict';

// Init GTM dataLayer for Analytics
let eventValue = 0;
let rating = '';

$('body').on('click', '.c-thermometer__emojis a', function () {
    $(this).addClass('selected');
});

$('body').on('click', '.c-thermometer-modal__footer .btn', function () {
    if ($(this).hasClass('btn-link')) {
        $(this).parents('.c-thermometer-modal__container').fadeOut();
        $('a.rate-this-page-action').removeClass('selected');
        $('.c-thermometer-modal__container textarea').val('');
    } else {
        const currentString = $(".c-thermometer-modal__container textarea").val()

        if (eventValue > 0) {
            // Submit DataLayer Event
            const dataLayer = window.dataLayer || [];
            dataLayer.push({
                event: 'rateThisPage',
                eventLabel: rating,
                eventValue: eventValue,
                eventFeedback: currentString
            });

            if (typeof (rudderanalytics) !== 'undefined') {
                rudderanalytics.track("feedback_submitted", { label: rating, rating: eventValue, feedback: currentString });
            }

            $(this).parents('.c-thermometer-modal__container').fadeOut(() => {
                $('.c-thermometer-modal__container').remove();
            });
            $('.c-thermometer__emojis').addClass('pointer-events-none');

            $('.c-thermometer-popup').fadeIn();

            setTimeout(() => {
                $('.c-thermometer-popup').fadeOut('fast');
            }, 3000)
        }
    }
});

$(".c-thermometer-modal__container textarea").on('keyup', function (event) {
    const currentString = $(this).val();
    $(".c-thermometer-modal__counter span").html(currentString.length);
});

$('body').on('click', function () {
    $('.c-thermometer__popup').hide();
});

$('body').on('click', '.c-thermometer-popup__close', function () {
    $(this).parent().fadeOut('fast');
});

$('body').on('click', '.c-thermometer__popup', function (e) {
    e.stopImmediatePropagation();
});

$('body').on('click', '.c-thermometer__trigger', function (e) {
    e.stopImmediatePropagation();
});

// Click Event for Ratings
$('body').on('click', '.c-thermometer__emojis a.rate-this-page-action', function () {
    const click_elem = $(this);
    click_elem.addClass('selected');

    // UX Update
    $('.c-thermometer-modal__container').fadeIn();

    // Prepare DataLayer Vars
    rating = click_elem.attr('data-rating');

    console.log(rating);

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
});
