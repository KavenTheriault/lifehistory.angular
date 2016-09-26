angular.module('myApp.calendar',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/calendar', {
        templateUrl: 'views/calendar_view.html',
        controller: 'CalendarController'
      })
      .when('/days/:date/new', {
        templateUrl: 'views/day_create.html',
        controller: 'DayCreateController'
      })
      .when('/days/:id/edit', {
        templateUrl: 'views/day_edit.html',
        controller: 'DayEditController'
      });
}])

.factory('Day',function($resource, CONFIG){
    return $resource(CONFIG.api_url + '/api/days/:id:date',{id:'@id'},{
        update: {
            method: 'PUT'
        }
    });
})

.controller('CalendarController',function($scope, $location, $filter, Day){
    $scope.selected_date=new Date();
    
    $scope.loadDay=function(){
        var date_string  = $filter('date')($scope.selected_date, 'yyyy-MM-dd');
        $scope.day=Day.get({date:date_string});
    }

    $scope.newDay=function(){
        var date_string  = $filter('date')($scope.selected_date, 'yyyy-MM-dd');
        $location.path('/days/' + date_string + '/new');
    }

    $scope.editDay=function($id){
        $location.path('/days/' + $id + '/edit');
    }

    $scope.loadDay();
})

.controller('DayCreateController',function($scope, $location, $routeParams, Day){
    $scope.day = new Day();
    $scope.day.date = $routeParams.date; //Need to stay a string for the api

    $scope.createDay=function(){
        $scope.day.$save(function(){
            $location.path('/calendar');
        });
    }

    $scope.newLifeEntry=function(){
        $scope.day.$save(function(){
            $location.path('/life_entries/new/' + $scope.day.id);
        });
    }
})

.controller('DayEditController',function($scope, $location, $routeParams, Day){
    $scope.day=Day.get({id:$routeParams.id});

    $scope.editDay=function(){
        $scope.day.$update(function(){
            $location.path('/calendar');
        });
    }

    $scope.newLifeEntry=function(){
        $location.path('/life_entries/new/' + $scope.day.id);
    }

    $scope.editLifeEntry=function($id){
        $location.path('/life_entries/' + $id + '/edit');
    }
});