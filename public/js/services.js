'use strict';

var services = angular.module('App.services', []);

services.factory('DataModel', function ($http, $log, $rootScope, $routeParams, $location, $stateParams) {

    var dataModel = {};
    dataModel.toggleViewOpen = true;
    dataModel.sideNav = [];
    dataModel.currentPage = {};

    dataModel.isPriNavActive = function(value){
        return ( value === $stateParams.navId )? 'active' : '';
    }

    return dataModel;
});


//services.factory('EmployeeService', function ($http, $log, $rootScope, $routeParams, $location, $stateParams) {
//
//    try {
//        var jsonrpc = new JSONRpcClient("http://192.168.1.140:7101/HRSCA-HRSCA-context-root/JSONServiceProvider");
//    } catch (e) {
//        $log.info('jsonrpc fail to connect');
//    }
//
//    return jsonrpc.EmployeeService;
//});
