/*

 SMINT V1.0 by Robert McCracken
 SMINT V2.0 by robert McCracken with some awesome help from Ryan Clarke (@clarkieryan) and mcpacosy ‏(@mcpacosy)

 SMINT is my first dabble into jQuery plugins!

 http://www.outyear.co.uk/smint/

 If you like Smint, or have suggestions on how it could be improved, send me a tweet @rabmyself

 */


(function(){


    $.fn.smint = function( options ) {

        var settings = $.extend({
            'scrollSpeed'  : 500,
            'mySelector'     : 'div'
        }, options);

        // adding a class to users div
        $(this).addClass('smint');



        //Set the variables needed
        var optionLocs = new Array();
        var lastScrollTop = 0;
        var menuHeight = $(".smint").height();
        var $this = $(this);
        var smint = $('.smint');
        var smintA = $('.smint a');
        var myOffset = smint.height();


        if ( settings.scrollSpeed ) {
            var scrollSpeed = settings.scrollSpeed
        }

        if ( settings.mySelector ) {
            var mySelector = settings.mySelector
        };


        return smintA.each( function(index) {

            var id = $(this).attr('href').split('#')[1];



            if (!$(this).hasClass("extLink")) {
                $(this).attr('id', id);
            }

            var my_top = $(mySelector+"."+id).position()?$(mySelector+"."+id).position().top:0;
            //Fill the menu
            optionLocs.push(Array(
                //$(mySelector+"."+id).position().top-menuHeight,
                my_top-menuHeight,
                $(mySelector+"."+id).height()+my_top, id)
            );

            ///////////////////////////////////

            // get initial top offset for the menu
            var stickyTop = smint.offset().top;

            // check position and make sticky if needed
            var stickyMenu = function(direction){

                // current distance top
                var scrollTop = $(window).scrollTop()+myOffset;

                // if we scroll more than the navigation, change its position to fixed and add class 'fxd', otherwise change it back to absolute and remove the class
                if (scrollTop > stickyTop+myOffset) {
                    smint.removeClass('not-fxd').addClass('fxd');
                } else {
                    smint.removeClass('fxd').addClass('not-fxd');
                }

                // Check if the position is inside then change the menu
                // Courtesy of Ryan Clarke (@clarkieryan)
                if(optionLocs[index][0] <= scrollTop && scrollTop <= optionLocs[index][1]){
                    if(direction == "up"){
                        $("#"+id).addClass("active");
                        $("#"+optionLocs[index+1][2]).removeClass("active");
                    } else if(index > 0) {
                        $("#"+id).addClass("active");
                        $("#"+optionLocs[index-1][2]).removeClass("active");
                    } else if(direction == undefined){
                        $("#"+id).addClass("active");
                    }
                    $.each(optionLocs, function(i){
                        if(id != optionLocs[i][2]){

                            $("#"+optionLocs[i][2]).removeClass("active");
                        }
                    });
                }
            };

            // run functions
            stickyMenu();

            // run function every time you scroll
            $(window).scroll(function() {
                //Get the direction of scroll
                var st = $(this).scrollTop()+myOffset;
                if (st > lastScrollTop) {
                    direction = "down";
                } else if (st < lastScrollTop ){
                    direction = "up";
                }
                lastScrollTop = st;
                stickyMenu(direction);

                // Check if at bottom of page, if so, add class to last <a> as sometimes the last div
                // isnt long enough to scroll to the top of the page and trigger the active state.

                if($(window).scrollTop() + $(window).height() == $(document).height()) {
                    smintA.removeClass('active')
                    $(".smint a:not('.extLink'):last").addClass('active')

                } else {
                    smintA.last().removeClass('active')
                }
            });

            ///////////////////////////////////////



            $(this).on('click', function(e){

                // if the link has the '.extLink' class it will be ignored
                // Courtesy of mcpacosy ‏(@mcpacosy)
                if ($(this).hasClass("extLink"))
                {
                    return true;
                }

                // gets the height of the users div. This is used for off-setting the scroll so the menu doesnt overlap any content in the div they jst scrolled to
                var myOffset = smint.height();

                // stops hrefs making the page jump when clicked
                e.preventDefault();


                // get the hash of the button you just clicked
                var hash = $(this).attr('href').split('#')[1];


                // gets the distance from top of the div class that matches your button id minus the height of the nav menu. This means the nav wont initially overlap the content.
                if (smint.hasClass('fxd')) {
                    var goTo =  $(mySelector+'.'+ hash).offset().top-myOffset;
                } else {
                    var goTo =  $(mySelector+'.'+ hash).offset().top-myOffset*2;
                }

                // Scroll the page to the desired position!
                $("html, body").stop().animate({ scrollTop: goTo }, scrollSpeed);





            });


            //This lets yo use links in body text to scroll. Just add the class 'intLink' to your button and it will scroll



            $('.intLink').on('click', function(e){
                var myOffset = smint.height();


                e.preventDefault();



                var hash = $(this).attr('href').split('#')[1];


                if (smint.hasClass('fxd')) {
                    var goTo =  $(mySelector+'.'+ hash).position().top-myOffset;
                } else {
                    var goTo =  $(mySelector+'.'+ hash).position().top-myOffset*2;
                }


                $("html, body").stop().animate({ scrollTop: goTo }, scrollSpeed);


                if ($(this).hasClass("extLink"))
                {
                    return false;
                }



            });
        });


    };


})();