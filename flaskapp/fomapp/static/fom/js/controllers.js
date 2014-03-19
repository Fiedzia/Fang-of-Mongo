var controllers = angular.module('fomControllers', []);

 
fomApp.controller('IndexCtrl', function ($scope) {
	  $scope.data = {"version":"0.1"};
});


fomApp.controller('PanelCtrl', function ($scope, $http) {
		$http.get('/rest/servers').success(function(data){
				$scope.servers = data.servers;
				$scope.$broadcast('dataloaded');
		});
}).directive('dataloaded', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, element, attrs) {
            $scope.$on('dataloaded', function () {
                $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                    server_tree();
                }, 0, false);
            })
        }
    };
}]);

