'use strict';

var directives = angular.module('App.directives', []);


directives.directive('swipeNav', function ($swipe, $log, DataModel) {

    function link($scope, element, attrs) {

        var swiping = 0,
            startX = 0,
            startOffset = 0,
            offset = 0,
            threshold = 200,
            cnt = 0,
            main = $('.main');


        var vendorPrefixes = ["webkit", "moz"];

        function getCSSProperty(property, value) {
            // cross browser CSS properties generator
            var css = {};
            css[property] = value;
            angular.forEach(vendorPrefixes, function (prefix, idx) {
                css['-' + prefix.toLowerCase() + '-' + property] = value;
            });
            return css;
        }

        $swipe.bind(main, {
            start: function (coords) {
                $log.info('start:');
                /* capture initial event position */
                if (swiping === 0) {
                    swiping = 1;
                    startX = coords.x;
                    var matrix = new WebKitCSSMatrix(window.getComputedStyle(main[0]).webkitTransform);
                    offset = matrix.m41;
                }
            },
            move: function (coords) {
//                $log.info('move:');

                /* follow cursor movement */
                if (swiping === 0) return;


                var deltaX = coords.x - startX;
                if (swiping === 1 && deltaX !== 0) {
                    swiping = 2;
                    startOffset = offset;
                }
                else if (swiping === 2) {

                    var ratio = 3;

                    offset = Math.round(startOffset + deltaX / ratio);

                    // hack to prevent to many move-updates
                    cnt++;
                    if (cnt > 2) {

//                    var delta = offset - currentOffset;
//                    $log.info(delta);

                        main.css('-webkit-transform', 'translate3d(' + offset + 'px,0,0)');
//                    main[0].style['-webkit-transform'] = getComputedStyle(main[0])['-webkit-transform'];
                        cnt = 0;
                    }
                }
            },
            end: function (coords) {
                /* when movement ends, go to next slide or stay on the same */

                var delta = coords.x - startX;

                if (swiping === 2) {
                    main.removeClass('noanimate');
                    main.css("transform", "");
                    var isOpen = DataModel.toggleViewOpen;
                    var isAction = false;

                    if (isOpen) {
                        if (delta < -threshold) {
                            isAction = true;
                        } else {
                            isAction = false;
                        }
                    } else {
                        if (delta < threshold) {
                            isAction = false;
                        } else {
                            isAction = true;
                        }
                    }

                    isOpen = (isAction) ? !isOpen : isOpen;

                    $scope.$apply(function () {
                        DataModel.toggleViewOpen = isOpen;
                    });

                }

                swiping = 0;
            }
        });
    }

    return {
        link: link
    };
});

