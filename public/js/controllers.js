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

controllers.controller('SequelSphereDBCtrl', function ($scope, $rootScope, $timeout, $log, $http, DataModel) {
    $log.info('SequelSphereDBCtrl');


    // hack to detects the virtual keyboard close action and fix the layout bug of fixed elements not being re-flowed
    $('input, textarea').on('blur', function(e) {

        $('.main').css('position', 'absolute');
        $timeout(function(){
            $('.main').css('position', 'fixed');
        },0)
    });


//    var sql = "SELECT *" +
//        "  FROM EmployeesEO";
//    var average_age = db.query(sql);


    $.getJSON("data.json", function(json) {
        $scope.$apply(function(){
            $scope.employeeList = json;
        });
    });


    $scope.onSelectEmployee = function(employee){

        $scope.originalEmployee = angular.copy(employee);

        if($scope.currentEmployee) $scope.currentEmployee.isActive = false;
        $scope.currentEmployee = employee;
        $scope.currentEmployee.isActive = true;




    }

    $scope.onSave = function(){
        resetSelection();
    }

    $scope.onCancel = function(){
        angular.extend($scope.currentEmployee, $scope.originalEmployee);
        resetSelection();

    }

    function resetSelection(){
        $scope.currentEmployee.isActive = false;
        $scope.currentEmployee = null;
        $scope.originalEmployee = null;
    }


//    EmployeeService.getEmployeesEOList(function(res, err){
//
//        if(err){
//            $log.info('FAIL',err);
//        }else{
//            $log.info('SUCCESS',res);
//
//            $scope.$apply(function(){
//                $scope.employeeList = res.list;
//
//                db.catalog.createTable({
//                    tableName: "EmployeesEO",
//                    columns: [ "employeeId", "lastName", "firstName", "phoneNumber", "email" ],
//                    primaryKey: [ "employeeId" ]});
//
//                db.catalog.setPersistenceScope(db.SCOPE_LOCAL);
//
//
//
//                var empTab = db.catalog.getTable("EmployeesEO");
//                for(var i=0;i<$scope.employeeList.length;i++) {
//                    var emp = $scope.employeeList[i];
//                    var newrow = [emp.employeeId,emp.lastName,emp.firstName,emp.phoneNumber,emp.email];
//                    empTab.insertRow(newrow);
//                }
//            })
//        }
//
//    });




//    $log.info(data);

    // Call a Java method on the server
    //var data = jsonrpc.EmployeeService.getEmployeesEO(124);
    //Display the result
    //result = jsonrpc.EmployeeService.deleteEmployeesEO(data);
//    data.firstName.value+='Az';
//    data.email+='Az';
//    data.employeeId+=1000;
//    result = jsonrpc.EmployeeService.getEmployeesEOList();
//    //result = jsonrpc.EmployeeService.getEmptyEmployeeEO();
//


});






