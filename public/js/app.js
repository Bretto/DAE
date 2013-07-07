'use strict';

angular.module('App', ['App.controllers', 'App.filters', 'App.services', 'App.directives', 'ngMobile', 'ui.compat']).
    config(function ($stateProvider, $urlRouterProvider, $routeProvider, $locationProvider, $provide) {

        $provide.decorator('$log', function($delegate) {
            var _log = $delegate.log;
            var _info = $delegate.info;
            var _debug = $delegate.debug;
            var _warn = $delegate.warn;
            var _error = $delegate.error;

            $delegate.zLog = function(msg){
                _log.apply(null,arguments)
                addLog(arguments, 'log');
            };

            $delegate.zInfo = function(msg){
                _info.apply(null,arguments)
                addLog(arguments, 'info');
            };

            $delegate.zDebug = function(msg){
                _debug.apply(null,arguments)
                addLog(arguments, 'debug');
            };

            $delegate.zWarn = function(msg){
                _warn.apply(null,arguments)
                addLog(arguments, 'warn');
            };

            $delegate.zError = function(msg){
                _error.apply(null,arguments)
                addLog(arguments, 'error');
            };

            function addLog(_arguments,type){
                var args = Array.prototype.slice.call(_arguments);
                angular.forEach(args, function(value, key){
                   if(angular.isObject(value)){
                       args[key] = JSON.stringify(value);
                   }
                });

                var msg = args + '';
                $('<div/>', {
                    text: msg
                }).addClass(type).appendTo('.logger');
            }

            return $delegate;
        });

        $stateProvider
            .state('nav', {
                url: '/nav/:navId',
                views: {
                    'nav@': {
                        templateUrl: 'partials/pri-nav.html'
                    }
                }
            })
            .state('nav.page', {
                url: '/page/:pageId',
                views: {
                    'page@': {
                        templateUrl: function (stateParams) {
                            return '/partials/' + stateParams.pageId + '.html';
                        }//,
                        //controller: 'PageCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise("/nav/requirement/page/requirement");
    }).
    run(
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
    });

// Check if a new cache is available on page load.
    window.addEventListener('load', function (e) {

        window.applicationCache.addEventListener('updateready', function (e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                // Swap it in and reload the page to get the new hotness.
                window.applicationCache.swapCache();
                if (confirm('A new version of this site is available. Load it?')) {
                    window.location.reload();
                }
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);





