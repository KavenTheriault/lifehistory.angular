'use strict';

angular.module('myApp.signup', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/signup', {
    templateUrl: 'views/signup.html',
    controller: 'SignUpCtrl'
  });
}])

.controller('SignUpCtrl', [function() {

}]);