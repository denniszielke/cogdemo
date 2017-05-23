var apiUrl = 'https://pcadlabdecweb.azurewebsites.net';

angular.module('CalculatorApp', [])
    .controller('CalculatorController',
        function ($scope, $http) {
            $scope.Calculate = function () {
                var postUrl = apiUrl + '/api/Calculation/' + $scope.id;
                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                $http.post(postUrl, { 'id': $scope.id})
                    .success(function (response) { $scope.result = response});
            }            
        }
    );