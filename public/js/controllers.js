'use strict';
/* App Controllers */

var controllers = angular.module('App.controllers', []);

//                $('.page').css('background-color', '#'+Math.floor(Math.random()*16777215).toString(16));

controllers.controller('AppCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.info('AppCtrl');

    $scope.dataModel = DataModel;

    $scope.onPriNavClick = function (page) {
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

});


controllers.controller('SequelSphereDBCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel, EmployeeService, LocalDB, STATES) {
    $log.info('SequelSphereDBCtrl');

    $scope.dataModel = DataModel;

//   $scope.employeeList = LocalDB.getEmployeeList();

    $scope.onDropTable = function(){
        db.catalog.dropTable("EMPLOYEES");
        db.commit();
    }


    $scope.onSelectEmployee = function (employee) {

        $log.info('onSelectEmployee');

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






