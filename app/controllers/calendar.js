angular.module('myApp.calendar',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/calendar', {
        templateUrl: 'views/calendar_view.html',
        controller: 'CalendarController'
      });
}])

.factory('Day',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/days/:id:date',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
})

.controller('CalendarController',function($scope, $filter, Day){
    $scope.selected_date=new Date();
    
    $scope.loadDay=function(){
        var date_string  = $filter('date')($scope.selected_date, 'yyyy-MM-dd');
        $scope.day=Day.get({date:date_string});
    }

    $scope.loadDay();
});