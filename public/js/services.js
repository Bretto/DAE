'use strict';

var services = angular.module('App.services', []);

services.factory('DataModel', function ($http, $log, $rootScope, $routeParams, $location) {

    var dataModel = {};
    dataModel.toggleViewOpen = true;
    dataModel.sideNav = [];
    dataModel.currentPage = {};

    dataModel.isPriNavActive = function(value){
        //return ( value === $stateParams.navId )? 'active' : '';
    }

    return dataModel;
});
