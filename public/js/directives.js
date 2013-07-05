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
//                $log.info('start:');
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

directives.directive('page', function ($log, DataModel, $timeout) {

    function link($scope, element, attrs) {
        $log.info('Page')

//        $timeout(function(){
//            element.addClass('scrollable')
//        }, 200)
    }

    return {
        link: link,
        scope: {}
    };
});


directives.directive('employee', function ($log, DataModel, $timeout) {

    function link($scope, element, attrs) {
//        $log.info('employee');


        $scope.getEmployeeClass = function (i) {
//            $log.info('getEmployeeClass');
            element.css('-webkit-transform', 'translate3d(0,' + 100 * i + '%,0)');
        }
    }

    return {
        link: link
    };
});

//directives.directive('inlineEdit', function($timeout) {
//    return {
//        scope: {
//            model: '=inlineEdit',
//            handleSave: '&onSave',
//            handleCancel: '&onCancel'
//        },
//        link: function(scope, elm, attr) {
//            var previousValue;
//
//            scope.edit = function() {
//                scope.editMode = true;
//                previousValue = scope.model;
//
//                $timeout(function() {
//                    elm.find('input')[0].focus();
//                }, 0, false);
//            };
//            scope.save = function() {
//                scope.editMode = false;
//                scope.handleCancel({value: scope.model});
//            };
//            scope.cancel = function() {
//                scope.editMode = false;
//                scope.model = previousValue;
//                scope.handleCancel({value: scope.model});
//            };
//        },
//        templateUrl: 'partials/inline-edit.html'
//    };
//});

//directives.directive('onEnter', function() {
//    return function(scope, elm, attr) {
//        elm.bind('keypress', function(e) {
//            if (e.keyCode === 13) {
//                scope.$apply(attr.onEnter);
//            }
//        });
//    };
//});
//
//directives.directive('onEsc', function() {
//    return function(scope, elm, attr) {
//        elm.bind('keydown', function(e) {
//            if (e.keyCode === 27) {
//                scope.$apply(attr.onEsc);
//            }
//        });
//    };
//});


directives.directive('main', function ($timeout, $log) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            var mainHeight;
            var main = $('.main');

            // hack to detects the virtual keyboard close action and fix the layout bug of fixed elements not being re-flowed
            function mainHeightChanged() {
                $('body').scrollTop(0);
            }

            window.setInterval(function () {
                if (mainHeight !== main.height())mainHeightChanged();
                mainHeight = main.height();
            }, 100);

        }
    }
});


directives.directive('employeeEdit', function ($log, DataModel, $timeout) {

    function link($scope, element, attrs) {

    }

    return {
        link: link
    };
});



directives.directive('syncBtn', function ($log, DataModel, $timeout, EmployeeService) {

    function link($scope, element, attrs) {
        var enable = true;
        var loading = false;
        var lableName = 'Synchronize';
        $scope.label = lableName;
        $scope.message = '';


        $scope.isEnable = function(){
            return enable
        }

        $scope.isLoading = function(){
            return loading
        }

        var showMessage = function(msg){
            $scope.message = msg;
            $scope.label = lableName;
            enable = true;
            loading = false;

            $timeout(function(){
                $scope.message = '';
            },5000);
        }

        $scope.onSynchronize = function () {
            $scope.label = 'Loading...';
            enable = false;
            loading = true;
            EmployeeService.syncEmployeeList().then(function(data){
                $scope.employeeList = data;
                showMessage('Synchronization success!');
            }, function (error) {
                showMessage('ERROR!');
            });
        }
    }

    return {
        scope:{},
        templateUrl: 'partials/sync-btn.html',
        replace: true,
        link: link
    };
});