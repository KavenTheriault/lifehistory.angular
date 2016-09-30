angular.module('myApp.calendar',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
      .when('/calendar', {
        templateUrl: 'views/calendar_view.html',
        controller: 'CalendarController'
      })
      .when('/calendar/:date', {
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

.controller('CalendarController',function($scope, $location, $routeParams, $filter, Day){
    if ($routeParams.date != null) {
        var parts = $routeParams.date.split('-');
        $scope.selected_date = new Date(parts[0],parts[1]-1,parts[2]);
    }
    else {
        $scope.selected_date = new Date();
    }
    
    $scope.loadDay=function(){
        var date_string  = $filter('date')($scope.selected_date, 'yyyy-MM-dd');
        $scope.day=Day.get({date:date_string});

        $location.update_path('/calendar/' + date_string);
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

.controller('DayCreateController',function($scope, $location, $routeParams, $filter, Day){
    $scope.day = new Day();
    $scope.day.date = $routeParams.date; //Need to stay a string for the api

    $scope.save_and_add = false;

    var parts = $scope.day.date.split('-');
    $scope.display_date = new Date(parts[0],parts[1]-1,parts[2]);

    $scope.goBack=function(){
        $location.path('/calendar/' + $scope.day.date);
    };

    $scope.createDay=function(){
        $scope.day.$save(function(){
            if ($scope.save_and_add) {
                $location.path('/life_entries/new/' + $scope.day.id);
            } else {
                $scope.goBack();
            }
        });
    };
})

.controller('DayEditController',function($scope, $location, $routeParams, $filter, Day){
    $scope.save_and_add = false;

    $scope.day=Day.get({id:$routeParams.id}, function(){
        var parts = $scope.day.date.split('-');
        $scope.display_date = new Date(parts[0],parts[1]-1,parts[2]);
    });

    $scope.goBack=function(){
        $location.path('/calendar/' + $scope.day.date);
    };

    $scope.editDay=function(){
        $scope.day.$update(function(){
            if ($scope.save_and_add) {
                $location.path('/life_entries/new/' + $scope.day.id);
            } else {
                $scope.goBack();
            }
        });
    };

    $scope.editLifeEntry=function($id){
        $location.path('/life_entries/' + $id + '/edit');
    };
});