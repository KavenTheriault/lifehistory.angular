angular.module('myApp.life_entries',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/life_entries/new/:day_id', {
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

.factory('TimeConverter', function($filter) {
    var TimeConverter = {};

    TimeConverter.convertTimeToDate = function(time_string) {
        var full_date_string = '1970-01-01 ' + $filter('limitTo')(time_string, 8, 1);
        return new Date(full_date_string);
    };

    TimeConverter.convertDateToTime = function(date) {
        var time_string = $filter('date')(date, "HH:mm");
        return time_string;
    };

    return TimeConverter;
 })

.controller('LifeEntryCreateController',function($scope, $location, $routeParams, LifeEntry){
    $scope.life_entry = new LifeEntry();
    $scope.life_entry.day_id = $routeParams.day_id;

    $scope.createLifeEntry=function(){
        $scope.life_entry.$save(function(){
            $location.path('/days/' + $scope.life_entry.day_id + '/edit');
        });
    }

})

.controller('LifeEntryEditController',function($scope, $location, $routeParams, TimeConverter, LifeEntry){
    $scope.life_entry=LifeEntry.get({id:$routeParams.id}, function(){
        $scope.start_date = TimeConverter.convertTimeToDate($scope.life_entry.start_time);
        $scope.end_date = TimeConverter.convertTimeToDate($scope.life_entry.end_time);
    });

    $scope.editLifeEntry=function(){
        $scope.life_entry.start_time = TimeConverter.convertDateToTime($scope.start_date);
        $scope.life_entry.end_time = TimeConverter.convertDateToTime($scope.end_date);

        $scope.life_entry.$update(function(){
            $location.path('/days/' + $scope.life_entry.day_id + '/edit');
        });
    };
});