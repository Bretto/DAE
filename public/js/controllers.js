'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

//                $('.page').css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));

controllers.controller('AppCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.zLog('AppCtrl');
//    $log.zLog('%cBlue! %cRed!', 'color: blue;', 'color: red;')
//    $log.zLog('%c YELLOW Background!', 'background-color: yellow;');
//    $log.zLog('%c RED Background!', 'background-color: red; color: white;')

    $scope.dataModel = DataModel;

    $scope.onPriNavClick = function (page) {
        $scope.currentPage = page;
    }


});


controllers.controller('PrimaryNavCtrl', function ($scope, $rootScope, $routeParams, $timeout, $log, $http, DataModel) {
    $log.zLog('PriNavCtrl');

//    $rootScope.$on('$routeChangeStart',function(scope,next,current){
//        $log.info('$routeChangeStart');
//
//    })

    $scope.dataModel = DataModel;

});

controllers.controller('PageCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.zLog('PageCtrl');

});


controllers.controller('SequelSphereDBCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel, EmployeeService, LocalDB, STATES) {
    $log.zLog('SequelSphereDBCtrl');

    $scope.dataModel = DataModel;

   $scope.employeeList = LocalDB.getEmployeeList().data;

    $scope.onDropTable = function(){
        db.catalog.dropTable("EMPLOYEES");
        db.commit();
    }


    $scope.onSelectEmployee = function (employee) {

        $log.zLog('onSelectEmployee');

        $scope.originalEmployee = angular.copy(employee);

        if ($scope.currentEmployee) $scope.currentEmployee.isActive = false;
        $scope.currentEmployee = employee;
        employee.isActive = true;

    }

    $scope.onSave = function (employee) {

        LocalDB.updateEmployee(employee);
        deSelectSelection();
    }



    $scope.onCancel = function () {
        angular.extend($scope.currentEmployee, $scope.originalEmployee);
        deSelectSelection();

    }

    function deSelectSelection() {
        $scope.currentEmployee.isActive = false;
        $scope.currentEmployee = null;
        $scope.originalEmployee = null;
    }

});






