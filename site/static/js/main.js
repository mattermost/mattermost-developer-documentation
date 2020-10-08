$(document).ready(function(){
    $('.header__menu-toggle, .sidebar__menu-toggle').on('click', function(){
        $(this).next().slideToggle();
    })

    $('.sub-menu__toggle').on('click', function(){
        $(this).parent().next('.sub-menu').toggle();
        $(this).toggleClass('fa-plus-square-o fa-minus-square-o');
    });

    let notifFlagExist = document.cookie.split(';').filter(item => { return item.indexOf('notifFlag=') >= 0}).length

    if(notifFlagExist){
        $(".notification-bar").addClass("closed");
        $("header").removeClass("with-notification-bar");
    }

    $('.notification-bar__close').on('click', function(){
        if(!notifFlagExist){
            $(".notification-bar").addClass("closed");
            $("header").removeClass("with-notification-bar");
        }
        document.cookie = 'notifFlag=true'
    });
});
