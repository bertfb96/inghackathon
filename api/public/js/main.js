var app = angular.module('ingApp', ['ja.qr']);


app.controller('HomeCtrl', function($scope, $http){
	var socket = io.connect('http://192.168.43.51:1000');

	$scope.qrString = '';
	
	socket.on('qr-created', function (data) {
	    var reference = data.d;
	    $scope.qrString = reference;
	   $scope.$apply();

	    /*$http.get("http://localhost:3000/api/payment/getByReferenceId?reference="+$scope.reference+" ").then(function(response) {
	        console.log(response);
	    });*/
	});


});

