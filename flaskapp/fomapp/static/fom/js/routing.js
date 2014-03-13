var fomApp = angular.module('fomApp', [
  'ngRoute',
  'fomControllers'
]);
 
fomApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/static/fom/templates/intro.html',
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
