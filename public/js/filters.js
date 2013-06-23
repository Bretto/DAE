'use strict';
/* http://docs-next.angularjs.org/api/angular.module.ng.$filter */

var filters = angular.module('App.filters', []);

filters.filter('cleanURL', function() {
    return function(input) {

        if(!input)return;

        var output = input.replace(/https:\/\/api.gilt.com\/v1/, '').replace(/\//g, '_');
        return output;
    }
});

filters.filter('age',function () {
    return function (text) {

        var age = moment(text, "DD-MM-YYYY").fromNow();

        return age;
    };
});

filters.filter('searchFilter', function ($filter) {

    return function (array, q) {

        var filter = $filter('filter');

        if(q){

            if(q.text){
                var searchArray = q.text.split(' ');
                for (var i = 0; i < searchArray.length; i++) {
                    var word = searchArray[i];
                    array = filter(array, word);
                }
            }



            if(q.age){
                var ageData = q.age.data;

                var checkDate = function(date, age) {

                    var time = moment().diff(moment(date, "DD-MM-YYYY"),'days', true);

                    if(time > age)return false;

                    return true;
                };

                var ageFiltered = [];
                for ( var j = 0; j < array.length; j++) {
                    var value = array[j];
                    if (checkDate(value.date, ageData)) {
                        ageFiltered.push(value);
                    }
                }
                array = ageFiltered;

            }

        }


        return array;
    }



});