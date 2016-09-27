angular.module('myApp.life_entry_activities',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/life_entry_activities/new/:life_entry_id', {
        templateUrl: 'views/life_entry_activity_create.html',
        controller: 'LifeEntryActivityCreateController'
      })
      .when('/life_entry_activities/:id/edit', {
        templateUrl: 'views/life_entry_activity_edit.html',
        controller: 'LifeEntryActivityEditController'
      });
}])

.factory('LifeEntryActivity',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/life_entry_activities/:id',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
})

.factory('ActivitySearch', function($q, Activity) {
   var ActivitySearch = {};

   ActivitySearch.searchActivity = function(val) {
        var d = $q.defer();
        var result = Activity.search({param:val}, function() {
            d.resolve(result);
        });
        return d.promise;
    };

    return ActivitySearch;
 })

.controller('LifeEntryActivityCreateController',function($scope, $location, $routeParams, LifeEntryActivity, ActivitySearch){
    $scope.life_entry_activity = new LifeEntryActivity();
    $scope.life_entry_activity.life_entry_id = $routeParams.life_entry_id;

    $scope.searchActivity = function(val) {
        return ActivitySearch.searchActivity(val);
    };

    $scope.createLifeEntryActivity=function(){
        $scope.life_entry_activity.activity_id = $scope.selected_activity.id;

        $scope.life_entry_activity.$save(function(){
            $location.path('/life_entries/' + $scope.life_entry_activity.life_entry_id + '/edit');
        });
    }

})

.controller('LifeEntryActivityEditController',function($window, $scope, $location, $routeParams, LifeEntryActivity, ActivitySearch){
    $scope.life_entry_activity=LifeEntryActivity.get({id:$routeParams.id}, function(){
            $scope.selected_activity = $scope.life_entry_activity.activity;
        });
    
    $scope.searchActivity = function(val) {
        return ActivitySearch.searchActivity(val);
    };

    $scope.editLifeEntryActivity=function(){
        $scope.life_entry_activity.activity_id = $scope.selected_activity.id;

        $scope.life_entry_activity.$update(function(){
            $location.path('/life_entries/' + $scope.life_entry_activity.life_entry_id + '/edit');
        });
    }

    $scope.deleteLifeEntryActivity=function($life_entry_activity){
        var deleteConfirmation = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteConfirmation) {
            $life_entry_activity.$delete(function(){
                $location.path('/life_entries/' + $life_entry_activity.life_entry_id + '/edit');
            });
        }
    };

});