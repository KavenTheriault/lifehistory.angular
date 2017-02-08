'use strict';

angular.module('myApp.search', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/search', {
    templateUrl: 'views/search.html',
    controller: 'SearchCtrl'
  });
}])

.controller('SearchCtrl',function($scope, $location, ActivitySearch, ActivityTypeSearch, LifeEntry){
    angular.isUndefinedOrNull = function(val) {
        return angular.isUndefined(val) || val === null 
    };

    $scope.searchActivity = function(val) {
        return ActivitySearch.searchActivity(val);
    };

    $scope.searchActivityType = function(val) {
        return ActivityTypeSearch.searchActivityType(val);
    };

    $scope.search = function() {
        var requestBody = {
            'activity_id': angular.isUndefinedOrNull($scope.selected_activity) ? $scope.selected_activity : $scope.selected_activity.id,
            'activity_type_id': angular.isUndefinedOrNull($scope.selected_activity_type) ? $scope.selected_activity_type : $scope.selected_activity_type.id,
            'start_date': $scope.start_date,
            'end_date': $scope.end_date,
        };

        $scope.results = LifeEntry.search(requestBody);
    };
});