$(document).ready(function(){
    $('.header__menu-toggle, .sidebar__menu-toggle').on('click', function(){
        $(this).next().slideToggle();
    })

    $('.sub-menu__toggle').on('click', function(){
        $(this).parent().next('.sub-menu').toggle();
        $(this).toggleClass('fa-plus-square-o fa-minus-square-o');
    });

    $('.notification-bar__close').on('click', function(){
       $(".notification-bar").addClass("closed");
       $("header").removeClass("with-notification-bar");
    });
});
