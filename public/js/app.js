'use strict';


//angular.module('App', ['App.controllers', 'App.filters', 'App.services', 'App.directives', 'ngMobile']).
//    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
//        $routeProvider.
//            when('/nav/requirement/page/requirement', {templateUrl:'partials/page1.html'}).
//            when('/nav/framework/page/framework', {templateUrl:'partials/page2.html'}).
//            when('/extra', {templateUrl:'partials/extra.html'}).
//            when('/reflection', {templateUrl:'partials/reflection.html'}).
//            when('/deployment', {templateUrl:'partials/deployment.html', controller:'PageCtrl'}).
//            when('/prototype', {templateUrl:'partials/prototype.html'}).
//            when('/admin', {templateUrl:'partials/admin.html'}).
//            when('/webservice', {templateUrl:'partials/webservice.html'}).
//            otherwise({redirectTo:'/requirement'});
//        $locationProvider.html5Mode(false);
//    }]);

angular.module('App', ['App.controllers', 'App.filters', 'App.services', 'App.directives', 'ngMobile', 'ui.compat']).
    config(function ($stateProvider, $urlRouterProvider, $routeProvider, $locationProvider) {

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





