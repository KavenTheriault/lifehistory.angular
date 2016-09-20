angular.module('myApp.activities',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/activities', {
        templateUrl: 'views/activities.html',
        controller: 'ActivitiesController'
      })
      .when('/activities/new', {
        templateUrl: 'views/activity_create.html',
        controller: 'ActivityCreateController'
      })
      .when('/activities/:id/edit', {
        templateUrl: 'views/activity_edit.html',
        controller: 'ActivityEditController'
      });
}])

.factory('Activity',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/activities/:id',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
})

.controller('ActivitiesController',function($window, $scope, $location, Activity){
    $scope.activities=Activity.query();

    $scope.newActivity=function(){
        $location.path('/activities/new');
    }

    $scope.editActivity=function($id){
        $location.path('/activities/' + $id + '/edit');
    }

     $scope.deleteActivity=function($activity){

        var deleteConfirmation = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteConfirmation) {
            $activity.$delete(function(){
                var index = $scope.activities.indexOf($activity);
                $scope.activities.splice(index, 1);
            });
        }
    }
})

.factory('ActivityTypeSearch', function($q, ActivityType) {
   var ActivityTypeSearch = {};

   ActivityTypeSearch.searchActivityType = function(val) {
        var d = $q.defer();
        var result = ActivityType.search({param:val}, function() {
            d.resolve(result);
        });
        return d.promise;
    };

    return ActivityTypeSearch;
 })

.controller('ActivityCreateController',function($scope, $location, Activity, ActivityTypeSearch){
    $scope.activity = new Activity();

    $scope.searchActivityType = function(val) {
        return ActivityTypeSearch.searchActivityType(val);
    };

    $scope.createActivity=function(){
        $scope.activity.activity_type_id = $scope.selected_activity_type.id;

        $scope.activity.$save(function(){
            $location.path('/activities');
        });
    }

})

.controller('ActivityEditController',function($scope, $location, $routeParams, Activity, ActivityTypeSearch){
    $scope.activity=Activity.get({id:$routeParams.id}, function(){
            $scope.selected_activity_type = $scope.activity.activity_type;
        });
    
    $scope.searchActivityType = function(val) {
        return ActivityTypeSearch.searchActivityType(val);
    };

    $scope.editActivity=function(){
        $scope.activity.activity_type_id = $scope.selected_activity_type.id;

        $scope.activity.$update(function(){
            $location.path('/activities');
        });
    }

});