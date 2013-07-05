'use strict';

var services = angular.module('App.services', []);

services.value('STATES', {
    online: true,
    lockUI: false
});

services.factory('DataModel', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, EmployeeService, LocalDB, $q, STATES) {

    var dataModel = {};
    dataModel.toggleViewOpen = true;
    dataModel.sideNav = [];
    dataModel.currentPage = {};


    dataModel.isOnline = function () {
        return STATES.online;
    }

    dataModel.isLockUI = function () {
        return STATES.lockUI;
    }

    dataModel.isPriNavActive = function (value) {
        return ( value === $stateParams.navId ) ? 'active' : '';
    }

    return dataModel;
});


services.factory('EmployeeService', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, $q, $timeout, STATES, LocalDB) {

    // Connect to the JSONRpcClient and set the online STATES flags

    var getJsonRpc = function () {

        var deferred = Q.defer();
        new JSONRpcClient("http://192.168.1.140:7101/HRSCA-HRSCA-context-root/JSONServiceProvider", function (JSONRpcClient, res, err) {

            $rootScope.$apply(function () {
                if (err) {
                    $log.info('jsonrpc fail to connect');
                    STATES.online = false;
                    deferred.reject(new Error(err))
                } else {
                    $log.info('jsonrpc connect');
                    STATES.online = true;
                    deferred.resolve(JSONRpcClient);
                }
            })
        });

        return deferred.promise;
    }


    // Get the employees table content
    var getEmployeeList = function (jsonrpc) {
        $log.info('getEmployeeList');

        var deferred = Q.defer();
        jsonrpc.EmployeeService.getEmployeesEOList(function (res, err) {
            if (err) {
                $log.info('getEmployeesEOList ERROR', err);
                deferred.reject(new Error(err))
            } else {
                $log.info('getEmployeesEOList SUCCESS', res);
                deferred.resolve(res.list);
            }
        });

        return deferred.promise;
    }


    // Sends the EmployeesTracker changes to the WS
    // and clear the EmployeesTracker changes
    var updateEmployeeList = function (jsonrpc) {
        $log.info('updateEmployeeList');

        var deferred = Q.defer();
        var changes = db.changeTrackers.get("EmployeesTracker").getChangedRows();
        $log.info('EmployeesTracker Changes:', changes);
        var data = JSON.stringify(changes);

        jsonrpc.EmployeeService.changes(function (res, err) {

            if (err) {
                $log.info('updateEmployeeList ERROR', err);
                deferred.reject(new Error(err));
            } else {
                $log.info('updateEmployeeList SUCCESS: ', res);
                db.changeTrackers.get("EmployeesTracker").clearChanges();
                deferred.resolve(jsonrpc);
            }

        }, data);
        return deferred.promise;
    }


    var syncEmployeeList = function () {
        $log.info('syncEmployeeList');

        //TODO check if the connection to the WS is available
        //TODO rename isOnline to isWSAvailable

        STATES.lockUI = true;

        var deferred = $q.defer();

        Q.fcall(getJsonRpc)
            .then(function (jsonrpc) {
                return updateEmployeeList(jsonrpc)
            })
            .then(function (jsonrpc) {
                return getEmployeeList(jsonrpc);
            })
            .then(function (employeeList) {
                LocalDB.updateEMPLOYEES(employeeList);

            })
            .catch(function (error) {
                $log.info('syncEmployeeList ERROR', error);
                $rootScope.$apply(function () {
                    STATES.lockUI = false;
                });
            })
            .done(function () {
                $log.info('syncEmployeeList COMPLETE');

                $rootScope.$apply(function () {
                    deferred.resolve(LocalDB.getEmployeeList().data);
                    STATES.lockUI = false;
                });
            });

        return deferred.promise;
    }


    return      {
        syncEmployeeList: syncEmployeeList
    };
});


services.factory('LocalDB', function ($http, $log, $rootScope, $routeParams, $location, $stateParams, $q) {

    var localDB = {};

    db.catalog.setPersistenceScope(db.SCOPE_LOCAL);

    if (db.catalog.getTable("EMPLOYEES") == null) {

        $log.info('CREATE EMPLOYEES');

        db.catalog.createTable({
            tableName: "EMPLOYEES",
            columns: [ "employeeId", "firstName", "lastName", "email" ],
            primaryKey: [ "employeeId" ]});

        db.commit();
    }

    if (db.changeTrackers.get("EmployeesTracker") == null) {
        db.changeTrackers.create("EmployeesTracker", ["EMPLOYEES"]);
    }

    // Update EMPLOYEES table and clear EmployeesTracker changes
    localDB.updateEMPLOYEES = function (employeeList) {
        $log.info('updateEMPLOYEES');

        var empTab = db.catalog.getTable("EMPLOYEES");
        for (var i = 0; i < employeeList.length; i++) {
            var emp = employeeList[i];
            var newrow = [emp.employeeId, emp.firstName, emp.lastName, emp.email];
            if (empTab.updateRow(newrow) == 0) empTab.insertRow(newrow);
        }

        db.commit();
        db.changeTrackers.get("EmployeesTracker").clearChanges();
        $log.info('EmployeesTracker CLEAR');
    }

    localDB.updateEmployee = function (employee) {


        var empTab = db.catalog.getTable("EMPLOYEES");
        empTab.updateRow(employee);

        // TODO chec Fail/Success and use ROLL BACK
        db.commit();
    }

    localDB.getEmployeeList = function () {
        return db.queryObjects("SELECT * FROM EMPLOYEES");
    }

    return localDB;
});

//        $timeout(function () {
//            $.getJSON("data.json", function (json) {
//                $rootScope.$apply(function () {
//                    deferred.resolve(json);
//                });
//            });
//        }, 100);




