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

    // list of `state` value/display objects
    self.states        = loadAll();
    self.selectedItem  = null;
    self.searchText    = null;
    self.querySearch   = querySearch;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states;
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';

      return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }

});