angular.module('myApp').controller('LoginCtrl', function($scope, $location, Mail) {
    $scope.moveon = function(googleUser) {
        var profile = googleUser.getBasicProfile();
        Mail.setEmail(profile.getEmail());
        $location.path('/board');
        $scope.$apply()
    }
})