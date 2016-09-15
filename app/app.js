'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngResource',
  'ngRoute',
  'ngCookies',
  'myApp.home',
  'myApp.signin',
  'myApp.signup',
  'myApp.activity_types'
])

.constant('CONFIG', {
    api_url: 'http://localhost:5000',
  })

.config(['$routeProvider',
	function($routeProvider) {
  		$routeProvider
  		.otherwise({redirectTo: '/home'});
	}]
)

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/signin' && !$rootScope.globals.currentUser) {
                $location.path('/signin');
            }
        });
    }]
);
