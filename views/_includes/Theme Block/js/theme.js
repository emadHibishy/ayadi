    // Start Theme Block
    $('.theme-block span').click(function () {
        $('.theme-block').toggleClass('move');
        $(this).children('svg').toggleClass('loader');
    });
    
    $('.theme-block .colors-list li').click(function () {
        // console.log($(this).data('color'));
        $("link[href*='theme']").attr('href', '/_includes/Theme Block/themes/' + $(this).data('color') + '-theme.css');
        localStorage.setItem('theme', $(this).data('color'));  
        // niceScrollFunction($(this).data('color'));
        $('.theme-block').removeClass('move');
        $('.theme-block span svg').removeClass('loader');
    });

    if(localStorage.getItem('theme') != null) {
        $("link[href*='theme']").attr('href', '/_includes/Theme Block/themes/' + localStorage.getItem('theme') + '-theme.css');
        niceScrollFunction(localStorage.getItem('theme'));
    }
    // End Theme Block