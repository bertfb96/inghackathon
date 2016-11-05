angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, $rootScope) {

    $rootScope.user = {
    "_id": "581d9e1cfe0389c8186a687d",
    "username": "ingbank",
    "name": "ING BANK",
    "surname": "",
    "pw": "123",
    "credit": 100,
    "type": true
  };

    var socket = io.connect('http://localhost:2020');

     // socket.emit('send', { message: 'Mehmet' });

    $http.get("http://localhost:3000/api/payment/getAll").then(function(response) {
        $scope.payList = response.data;
    });


    $scope.payData = {};
    $scope.addPay = function(){
      var payName = $scope.payData.text;

      $http.post("http://localhost:3000/api/payment/add?name="+payName+" ").then(function(response) {
        $scope.payList.push({'name': payName});
      });
    };
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
