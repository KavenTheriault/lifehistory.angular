'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngResource',
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'ngSanitize',
  'ngLocationUpdate',
  'ui.bootstrap',
  'myApp.home',
  'myApp.signin',
  'myApp.signup',
  'myApp.activity_types',
  'myApp.activities',
  'myApp.calendar',
  'myApp.life_entries',
  'myApp.life_entry_activities',
  'myApp.search'
])

.constant('CONFIG', {
    api_url: 'http://0.0.0.0:5000',
  })

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
  		$routeProvider.otherwise({redirectTo: '/signin'});
      $locationProvider.html5Mode(true).hashPrefix('');
	}]
)

.run(['$rootScope', '$location', '$cookieStore', '$http', 'AuthenticationService',
    function ($rootScope, $location, $cookieStore, $http, AuthenticationService) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if (($location.path() !== '/signin' && $location.path() !== '/signup') && !$rootScope.globals.currentUser) {
                $location.path('/signin');
            }

            if (($location.path() == '/signin' || $location.path() == '/signup') && $rootScope.globals.currentUser) {
                $location.path('/calendar');
            }
        });

        $rootScope.logout=function(){
          AuthenticationService.ClearCredentials();
        };
    }]
);
