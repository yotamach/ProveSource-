var app = angular.module('app', []);

app.controller('conversions', ['$scope','$http', function($scope,$http) {
  $scope.userErrorMessage = '';
  $scope.conversionsErrorMessage = '';
  $scope.dateRangeErrorMessage = '';
  $scope.sumOfConversionsInSelectedPeriod = 0;
  $scope.conversions = [];
  $http.get('http://localhost:3000/account/fetch').
  then(function(response) {
      $scope.users = response.data.users;
  });
  $scope.master = {};
  $scope.createAccount = function(account) {
    $scope.userErrorMessage = '';
    $http.post('http://localhost:3000/account/create', account).then(function (response) {
        $scope.users.push(response.data.user);
      }, function (response) {
        $scope.userErrorMessage = response.data.error.message;
      });
  };

  $scope.createConversion = function(conversionName) {
    $scope.conversionsErrorMessage = '';
    if(!$scope.selectedUser.name)
    {
      $scope.conversionsErrorMessage = "user isn't selected";
      return;
    } 
    $http.post('http://localhost:3000/conversion/create', {name: conversionName, userId: $scope.selectedUser._id}).then(function (response) {
        $scope.conversions.push(response.data.conversion);
      }, function (response) {
        $scope.conversionsErrorMessage = response.data.error.message;
      });
  };

  $scope.selectedUser = {
    name: '',
    age: '',
    email: ''
  };
  $scope.select = function(sUser) {
      $scope.selectedUser = sUser;
      $scope.conversionsErrorMessage = '';
      $scope.conversions = [];

      $http.get('http://localhost:3000/conversion/fetch?userId=' + sUser._id).
      then(function(response) {
          $scope.conversions = response.data.conversions;
      }, function (response) {
        $scope.conversionsErrorMessage = response.data.error.message;
      });
  };

  $scope.sumOfevents = function(conversion) {
    let sum = 0;
    Object.keys(conversion.countByDate).forEach(date => {
      sum += conversion.countByDate[date];
    });
    return sum;
  }

  $scope.increaseConversion = function(conversion) {
    $scope.conversionsErrorMessage = '';
    $http.post('http://localhost:3000/conversion/count', {name: conversion.name, userId: $scope.selectedUser._id}).then(function (response) {
      const convIndex = $scope.conversions.findIndex((conv => conv._id === conversion._id));
      $scope.conversions[convIndex] = response.data.conversion;
    }, function (response) {
      $scope.conversionsErrorMessage = response.data.error.message;
    });
  }

  $scope.sumOfConversionsByUser = function(startDate,endDate) {
    $scope.sumOfConversionsInSelectedPeriod = 0;
    $scope.dateRangeErrorMessage = '';
    if(moment(endDate).isBefore(moment(startDate))) {
      $scope.dateRangeErrorMessage = 'End date is earlier then before date';
      return;
    }    
    if(!$scope.selectedUser._id) {
      $scope.dateRangeErrorMessage = "User isn't selected";
      return;
    }
    $http.get('http://localhost:3000/conversion/total-by-date?userId=' + $scope.selectedUser._id + '&startDate=' + startDate + '&endDate=' + endDate).
    then(function(response) {
       $scope.sumOfConversionsInSelectedPeriod = response.data.sum;
    }, function (response) {
      $scope.conversionsErrorMessage = response.data.error.message;
    });

  }

}]);

