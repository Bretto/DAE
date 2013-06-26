'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);


controllers.controller('AppCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.info('AppCtrl');

    $scope.dataModel = DataModel;

    $scope.onPriNavClick = function(page){
        $scope.currentPage = page;
    }

});


controllers.controller('PrimaryNavCtrl', function ($scope, $rootScope, $routeParams, $timeout, $log, $http, DataModel) {
    $log.info('PriNavCtrl');

//    $rootScope.$on('$routeChangeStart',function(scope,next,current){
//        $log.info('$routeChangeStart');
//
//    })


    $scope.dataModel = DataModel;



});

controllers.controller('PageCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.info('PageCtrl');


    //$timeout

//    $scope.doIt = function(){
//        $log.info('test');
//        //$(this).addClass('mc-enter');
//    }

});


// Declare app level module which depends on filters, and services












