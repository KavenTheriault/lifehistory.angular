angular.module('myApp.activity_type',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/activity_type', {
    templateUrl: 'views/activity_type.html',
    controller: 'ActivityTypeController'
  });
}])

.factory('ActivityType',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/activity_types/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
})

.controller('ActivityTypeController',function($scope, ActivityType){
    $scope.activity_type = new ActivityType();

    $scope.create=function(){
        $scope.activity_type.$save(function(){
            // Save success
        });
    }

});