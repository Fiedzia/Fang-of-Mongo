var fomApp = angular.module('fomApp', [
  'ngRoute',
  'fomControllers'
]);
 
fomApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'main.html',
        controller: 'IndexCtrl'
      }).
      when('/newdb/', {
        templateUrl: 'whatever/newdb.html',
        controller: 'NewDBCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
