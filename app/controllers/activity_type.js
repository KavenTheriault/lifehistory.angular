angular.module('myApp.activity_types',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/activity_types', {
        templateUrl: 'views/activity_types.html',
        controller: 'ActivityTypesController'
      })
      .when('/activity_types/new', {
        templateUrl: 'views/activity_type_create.html',
        controller: 'ActivityTypeCreateController'
      })
      .when('/activity_types/:id/edit', {
        templateUrl: 'views/activity_type_edit.html',
        controller: 'ActivityTypeEditController'
      });
}])

.factory('ActivityType',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/activity_types/:id:listCtrl/:param',{id:'@id'},{
        update: {
            method: 'PUT'
        },
        search: {
            method: 'GET',
            isArray: true,
            params: {
                listCtrl: 'search',
                param: true
            }
        }
    });
})

.controller('ActivityTypesController',function($window, $scope, $location, ActivityType){
    $scope.activity_types=ActivityType.query();

    $scope.newActivityType=function(){
        $location.path('/activity_types/new');
    }

    $scope.editActivityType=function($id){
        $location.path('/activity_types/' + $id + '/edit');
    }

     $scope.deleteActivityType=function($activity_type){

         var deleteConfirmation = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteConfirmation) {
            $activity_type.$delete(function(){
                var index = $scope.activity_types.indexOf($activity_type);
                $scope.activity_types.splice(index, 1);
            });
        }
    }

})

.controller('ActivityTypeCreateController',function($scope, $location, ActivityType){
    $scope.activity_type = new ActivityType();

    $scope.createActivityType=function(){
        $scope.activity_type.$save(function(){
            $location.path('/activity_types');
        });
    }

})

.controller('ActivityTypeEditController',function($scope, $location, $routeParams, ActivityType){
    $scope.activity_type=ActivityType.get({id:$routeParams.id});

    $scope.editActivityType=function(){
        $scope.activity_type.$update(function(){
            $location.path('/activity_types');
        });
    }

});