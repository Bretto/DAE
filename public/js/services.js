'use strict';

var services = angular.module('App.services', []);

services.factory('DataModel', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, EmployeeService, LocalDB, $q) {

    var dataModel = {};
    dataModel.toggleViewOpen = true;
    dataModel.sideNav = [];
    dataModel.currentPage = {};
    dataModel.isOnline = true;

    dataModel.isPriNavActive = function (value) {
        return ( value === $stateParams.navId ) ? 'active' : '';
    }

    dataModel.getEmployeeList = function () {

        var responce

        if (dataModel.isOnline) {

            var deferred = $q.defer();
            EmployeeService.getEmployeeList().then(function (employeeList) {
                LocalDB.setEmployeeList(employeeList);
                    deferred.resolve(LocalDB.getEmployeeList().data);
            });
            responce = deferred.promise;

        } else {

            responce = LocalDB.getEmployeeList().data;
        }

        return responce
    }

    return dataModel;
});


services.factory('EmployeeService', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, $q, $timeout) {

    try {
        var jsonrpc = new JSONRpcClient("http://192.168.1.140:7101/HRSCA-HRSCA-context-root/JSONServiceProvider");
    } catch (e) {
        $log.info('jsonrpc fail to connect');
    }

    var employeeService = {};

    employeeService.getEmployeeList = function () {
        var deferred = $q.defer();

//        $timeout(function () {
//            $.getJSON("data.json", function (json) {
//                $rootScope.$apply(function () {
//                    deferred.resolve(json);
//                });
//            });
//        }, 100);

        jsonrpc.EmployeeService.getEmployeesEOList(function (res, err) {
            $rootScope.$apply(function () {
                if (err) {
                    $log.info('getEmployeesEOList FAIL', err);
                    deferred.reject({error: err})
                } else {
                    $log.info('getEmployeesEOList SUCCESS', res);
                    deferred.resolve(res.list);
                }
            })
        });

        return deferred.promise;
    }


    return employeeService;
});


services.factory('LocalDB', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, $q) {

    var localDB = {};



//    db.onready(function() {

        db.catalog.setPersistenceScope(db.SCOPE_LOCAL);

        if(db.catalog.getTable("EMPLOYEES") == null){

            $log.info('CREATE EMPLOYEES');

            db.catalog.createTable({
                tableName: "EMPLOYEES",
                columns: [ "employeeId", "firstName", "lastName", "email" ],
                primaryKey: [ "employeeId" ]});

//            db.catalog.createTable({
//                tableName: "EMPLOYEES",
//                columns: [ "ID", "NAME", "AGE", "EMAIL" ],
//                primaryKey: [ "ID" ]});

            db.commit();
        }

//        db.catalog.dropTable("EMPLOYEES");
//        db.commit();
//        $rootScope.$emit('dbReady');
//    });

//    localDB.setEmployeeList = function (employeeList) {
//
//        var empTab = db.catalog.getTable("EMPLOYEES");
//        for (var i = 0; i < employeeList.length; i++) {
//            var emp = employeeList[i];
//            var newrow = [i, emp.name, emp.age, emp.email];
//
//            var selectRow = db.queryObjects("SELECT * FROM EMPLOYEES WHERE ID="+ i);
//
//            if(selectRow){
//                empTab.updateRow(newrow);
//            }else{
//                empTab.insertRow(newrow);
//            }
//        }
//
//        $log.info('SET EMPLOYEES');
//        db.commit();
//    }

    localDB.setEmployeeList = function (employeeList) {

        var empTab = db.catalog.getTable("EMPLOYEES");
        for (var i = 0; i < employeeList.length; i++) {
            var emp = employeeList[i];
            var newrow = [emp.employeeId, emp.firstName, emp.lastName, emp.email];

            var selectRow = db.queryRowObject("SELECT * FROM EMPLOYEES WHERE EMPLOYEEID="+ emp.employeeId);

            if(selectRow){
                empTab.updateRow(newrow);
            }else{
                empTab.insertRow(newrow);
            }

        }

        $log.info('SET EMPLOYEES');
        db.commit();
    }

//    localDB.getEmployeeList = function (employeeList) {
//        var deferred = $q.defer();
//        $('body').sqlExec({
//            op: "queryObjects",
//            sql: "SELECT * FROM EMPLOYEES",
//            success: function (selected, results, options) {
//                $rootScope.$apply(function () {
//                    $log.info('employeeList SUCCESS', results.data);
//                    deferred.resolve(results.data);
//                });
//            },
//            error: function (err, options) {
//
//            }
//        });
//        return deferred.promise;
//    }

    localDB.getEmployeeList = function () {
        return db.queryObjects("SELECT * FROM EMPLOYEES");
    }

    return localDB;
});




