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

.controller('ActivitiesController',function($scope, $location, Activity){
    $scope.activities=Activity.query();

    $scope.newActivity=function(){
        $location.path('/activities/new');
    }

    $scope.editActivity=function($id){
        $location.path('/activities/' + $id + '/edit');
    }

     $scope.deleteActivity=function($activity){
        $activity.$delete(function(){
            var index = $scope.activities.indexOf($activity);
            $scope.activities.splice(index, 1);
        });
    }

})

.controller('ActivityCreateController',function($scope, $rootScope, $location, Activity){
    $scope.activity = new Activity();

    $scope.createActivity=function(){
        $scope.activity.activity_type_id = $rootScope.selected_activity_type.id;

        $scope.activity.$save(function(){
            $location.path('/activities');
        });
    }

})

.controller('ActivityEditController',function($scope, $rootScope, $location, $routeParams, $log, Activity){
    $scope.activity=Activity.get({id:$routeParams.id}, function(){
            $rootScope.selected_activity_type = $scope.activity.activity_type;
        });
    
    $scope.editActivity=function(){
        $scope.activity.activity_type_id = $rootScope.selected_activity_type.id;

        $scope.activity.$update(function(){
            $location.path('/activities');
        });
    }

})

.controller('ActivityTypeSearch', function($scope, $rootScope, $q, ActivityType) {
    //$rootScope.selected_activity_type = null;

    $scope.searchActivityType = function(val) {
        var d = $q.defer();
        var result = ActivityType.search({param:val}, function() {
            d.resolve(result);
        });
        return d.promise;
    };
});