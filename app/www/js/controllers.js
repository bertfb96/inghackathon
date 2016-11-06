angular.module('starter.controllers', [])

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.controller('DashCtrl', function($scope, $http, $rootScope, $cordovaBarcodeScanner, $ionicPlatform) {

    var socket = io.connect('http://192.168.137.120:1000');

    socket.on('accepted_pay', function(data){
      $rootScope.payList.push(data.d.data);
      $scope.$apply();
    });

     // socket.emit('send', { message: 'Mehmet' });

     /*
    $http.get("http://localhost:3000/api/payment/getAll").then(function(response) {
        $scope.payList = response.data;
    });*/

    var tutarOnay = new Audio('http://jqueryegitimseti.com/sound/tutar.ogg');
    var tamamlandi = new Audio('http://jqueryegitimseti.com/sound/tamamlandi.ogg');
    


    /*Read qr code*/
    $scope.qrData = {};
    $scope.payVar = {status:0};

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


                $http.get("http://192.168.137.120:3000/api/payment/getByReferenceId?reference="+ result.text +" ").then(function(response) {
                    if (response.data[0].status) {
                      $scope.payVar.status = 0;
                      alert('Bu ödeme zaten yapılmış.');
                      return false;
                    };

                    $scope.payVar = response.data[0];
                    $scope.payVar.status = 1;
                    tutarOnay.play();
                });


            }, function(error) {
                // An error occurred
                $scope.qrData.scanResults = 'Error: ' + error;
            });
        });
    };

    $scope.acceptPay = function(){
      // http://localhost:3000/api/payment/acceptPay/581d9e3efe0389c8186a687e/581d9e1cfe0389c8186a687d/40

      $http.put("http://192.168.137.120:3000/api/payment/acceptPay/"+$rootScope.user._id+"/"+$scope.payVar.businessId+"/"+$scope.payVar.price+"/"+ $scope.payVar.reference +" ").then(function(response) {
          tutarOnay.pause();
          tamamlandi.play();
          $scope.payVar.status = 0;

          $http.get("http://192.168.137.120:3000/api/user/getById?_id="+ $rootScope.user._id +"").then(function(response){
             $rootScope.user.credit = response.data.credit;
          });


          $http.get("http://192.168.137.120:3000/api/payment/getByReferenceId?reference="+ $scope.payVar.reference +" ").then(function(response){
            console.log(response.data[0]);
            socket.emit('acceptPay', { data: response.data[0] });
          });
          

          $scope.$apply();
          $rootScope.$apply();
      });
    }

    $scope.declinePay = function(){
        $scope.payVar.status = 0;
        $scope.$apply();
    }

    
    /*Read qr code*/

    /*$rootScope.user = {
      "_id": "581d9e1cfe0389c8186a687d",
      "username": "ingbank",
      "name": "ING BANK",
      "surname": "",
      "pw": "123",
      "credit": 100,
      "type": false
    };*/

    


    $scope.payData = {};
    $scope.payData.tutar = ' ';

    $scope.addPay = function(){
      var pay_reference = guid();

      $http.post("http://192.168.137.120:3000/api/payment/add?referance="+pay_reference+"&businessId="+$rootScope.user._id+"&price="+$scope.payData.tutar+" ").then(function(response) {
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

      $http.get("http://192.168.137.120:3000/api/user/login?username="+username+"&pw="+ pw +" ").then(function(response) {
        if (response.data[0]) {
          $scope.loginErr = false;
          $rootScope.user= response.data[0];


          $rootScope.payList = {};
          $http.get("http://192.168.137.120:3000/api/payment/getPaymentList?userId="+ $rootScope.user._id +" ").then(function(response){
            $rootScope.payList = response.data;
            console.log($scope.payList);
          });

          $state.go('tab.dash');

        }else{
          $scope.loginErr = "Kullanıcı adı yada şifre yanlış."
        }
      });
    }
});
