angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope, $cordovaBarcodeScanner, $ionicPlatform) {

    /*Read qr code*/
    $scope.qrData = {};

    $scope.scan = function(){
        $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner
            .scan()
            .then(function(result) {
                // Success! Barcode data is here
                $scope.qrData.scanResults = "We got a barcoden" +
                "Result: " + result.text + "n" +
                "Format: " + result.format + "n" +
                "Cancelled: " + result.cancelled;

                /*burası vps e atılınca aktifleştirilecek*/
                /*
                $http.get("http://localhost:3000/api/payment/getByReferenceId?reference="+ result.text +" ").then(function(response) {
                  alert('');
                });*/

                

            }, function(error) {
                // An error occurred
                $scope.qrData.scanResults = 'Error: ' + error;
            });
        });
    };

    
    
    /*Read qr code*/

    $rootScope.user = {
      "_id": "581d9e1cfe0389c8186a687d",
      "username": "ingbank",
      "name": "ING BANK",
      "surname": "",
      "pw": "123",
      "credit": 100,
      "type": false
    };

    var socket = io.connect('http://localhost:2020');

     // socket.emit('send', { message: 'Mehmet' });

     /*
    $http.get("http://localhost:3000/api/payment/getAll").then(function(response) {
        $scope.payList = response.data;
    });*/


    $scope.payData = {};
    $scope.payData.tutar = ' ';

    $scope.addPay = function(){
      var pay_reference = guid();

      $http.post("http://localhost:3000/api/payment/add?referance="+pay_reference+"&businessId="+$rootScope.user._id+"&price="+$scope.payData.tutar+" ").then(function(response) {
        socket.emit('message', { reference: pay_reference });
      });
    };


    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $rootScope, $http, $state) {
    $scope.user = {};

    $scope.login = function(){
      var username = $scope.user.username;
      var pw = $scope.user.pw;

      $http.get("http://localhost:3000/api/user/login?username="+username+"&pw="+ pw +" ").then(function(response) {
        if (response.data[0]) {
          $scope.loginErr = false;
          $rootScope.user= response.data[0];

          console.log($rootScope);

          $state.go('tab.dash');

        }else{
          $scope.loginErr = "Kullanıcı adı yada şifre yanlış."
        }
      });
    }
});
