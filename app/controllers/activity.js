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

.controller('ActivityCreateController',function($scope, $location, Activity){
    $scope.activity = new Activity();

    $scope.createActivity=function(){
        $scope.activity.$save(function(){
            $location.path('/activities');
        });
    }

})

.controller('ActivityEditController',function($scope, $location, $routeParams, Activity){
    $scope.activity=Activity.get({id:$routeParams.id});

    $scope.editActivity=function(){
        $scope.activity.$update(function(){
            $location.path('/activities');
        });
    }

})

.controller('ActivityTypeSearch',function($scope, $timeout, $q, ActivityType){
    var self = this;

    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;

    function querySearch (query) {
        var d = $q.defer();
        var result = ActivityType.search({param:query}, function() {
            d.resolve(result);
        });
        return d.promise;
    }

})

.controller('TypeaheadCtrl', function($scope, $http) {

  $scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };
  
});