angular.module('myApp.life_entries',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/life_entries/new', {
        templateUrl: 'views/life_entry_create.html',
        controller: 'LifeEntryCreateController'
      })
      .when('/life_entries/:id/edit', {
        templateUrl: 'views/life_entry_edit.html',
        controller: 'LifeEntryEditController'
      });
}])

.factory('LifeEntry',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/life_entries/:id',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
})

.controller('LifeEntryCreateController',function($scope, $location, LifeEntry){
    $scope.life_entry = new LifeEntry();

    $scope.createLifeEntry=function(){
        $scope.life_entry.$save(function(){
            $location.path('/life_entries');
        });
    }

})

.controller('LifeEntryEditController',function($scope, $location, $routeParams, LifeEntry){
    $scope.life_entry=LifeEntry.get({id:$routeParams.id});

    $scope.editLifeEntry=function(){
        $scope.life_entry.$update(function(){
            $location.path('/life_entries');
        });
    }

});