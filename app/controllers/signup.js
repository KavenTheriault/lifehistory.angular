'use strict';

angular.module('myApp.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl',function($scope, AuthenticationService){
    $scope.signup = function () {
        $scope.dataLoading = true;
        AuthenticationService.Register($scope.username, $scope.password, $scope.name, function(response) {
            if(response.status == 201) {
            	$scope.message = 'Account successfully created. You can now sign in.';
            	$scope.dataLoading = false;
            } else {
                $scope.error = 'Invalid information. Please try again.';
                $scope.dataLoading = false;
            }
        });
    };
});