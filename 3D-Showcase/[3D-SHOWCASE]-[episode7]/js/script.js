$('.menuClickZone').on('click', function (event) {
    event.preventDefault();
    if( $('.menuswitch').hasClass('plus') ){
        TweenMax.staggerFrom('.s-btn',.05, {y:10}, 0.05);
        $('.s-btn-container').removeClass('menuVis');
        $('.menuswitch').toggleClass('plus');
    }
    else {
        $('.s-btn-container').addClass('menuVis');
        $('.menuswitch').toggleClass('plus');
    }
});