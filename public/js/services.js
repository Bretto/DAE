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
        $log.zLog('getJsonRpc');

        var deferred = Q.defer();

        $timeout(function () {
            $rootScope.$apply(function () {
                $log.zInfo('jsonrpc connect');
                STATES.online = true;

                deferred.resolve({});

            }, 100);
        });
//        new JSONRpcClient("http://192.168.1.140:7101/HRSCA-HRSCA-context-root/JSONServiceProvider", function (JSONRpcClient, res, err) {
//
//            $rootScope.$apply(function () {
//                if (err) {
//                    $log.zInfo('jsonrpc fail to connect');
//                    STATES.online = false;
//                    deferred.reject(new Error(err))
//                } else {
//                    $log.zInfo('jsonrpc connect');
//                    STATES.online = true;
//                    deferred.resolve(JSONRpcClient);
//                }
//            })
//        });

        return deferred.promise;
    }


    // Get the employees table content
    var getEmployeeList = function (jsonrpc) {
        $log.zLog('getEmployeeList');
        var deferred = Q.defer();

        $timeout(function () {
            $log.zInfo('getEmployeesEOList SUCCESS')
            $log.zDebug(db.queryObjects("SELECT * FROM EMPLOYEES"));
            deferred.resolve({});
        }, 100);

//        jsonrpc.EmployeeService.getEmployeesEOList(function (res, err) {
//            if (err) {
//                $log.zError('getEmployeesEOList ERROR', err);
//                deferred.reject(new Error(err))
//            } else {
//                $log.zInfo('getEmployeesEOList SUCCESS', res);
//                deferred.resolve(res.list);
//            }
//        });

        return deferred.promise;
    }


    // Sends the EmployeesTracker changes to the WS
    // and clear the EmployeesTracker changes
    var updateEmployeeList = function (jsonrpc) {
        $log.zLog('updateEmployeeList');

        var deferred = Q.defer();

        $timeout(function () {

            $log.zInfo('updateEmployeeList SUCCESS');

            deferred.resolve({});

        }, 100);

//        var changes = db.changeTrackers.get("EmployeesTracker").getChangedRows();
//        $log.zInfo('EmployeesTracker Changes:', changes);
//        var data = JSON.stringify(changes);
//
//        jsonrpc.EmployeeService.changes(function (res, err) {
//
//            if (err) {
//                $log.zInfo('updateEmployeeList ERROR', err);
//                deferred.reject(new Error(err));
//            } else {
//                $log.zInfo('updateEmployeeList SUCCESS: ', res);
//                db.changeTrackers.get("EmployeesTracker").clearChanges();
//                deferred.resolve(jsonrpc);
//            }
//
//        }, data);
        return deferred.promise;
    }


    var syncEmployeeList = function () {
        $log.zLog('syncEmployeeList');

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
            .catch(function (err) {
                $log.zError('syncEmployeeList ERROR', err);
                $rootScope.$apply(function () {
                    STATES.lockUI = false;
                });
                deferred.reject(new Error(err));
            })
            .done(function () {
                $log.zInfo('syncEmployeeList COMPLETE');

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

        $log.zLog('CREATE EMPLOYEES');

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
        $log.zLog('updateEMPLOYEES');

        $log.zInfo('updateEMPLOYEES COMPLETE');
//        var empTab = db.catalog.getTable("EMPLOYEES");
//        for (var i = 0; i < employeeList.length; i++) {
//            var emp = employeeList[i];
//            var newrow = [emp.employeeId, emp.firstName, emp.lastName, emp.email];
//            if (empTab.updateRow(newrow) == 0) empTab.insertRow(newrow);
//        }
//        $log.zInfo('updateEMPLOYEES COMPLETE');
//        db.commit();
//        db.changeTrackers.get("EmployeesTracker").clearChanges();
//        $log.zInfo('EmployeesTracker CLEAR');
        // TODO chec Fail/Success and use ROLL BACK
    }



    localDB.getEmployeeList = function () {
        return db.queryObjects("SELECT * FROM EMPLOYEES");
    }

    return localDB;
});

//$.getJSON("data.json", function (json) {
//    $log.zInfo('getEmployeesEOList SUCCESS', json);
//    deferred.resolve(json);
//});





