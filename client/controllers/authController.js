/**
 * AuthController — Handles login and registration forms
 */
app.controller('AuthController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
  $scope.loginData = { email: '', password: '' };
  $scope.registerData = { username: '', email: '', password: '', bio: '' };
  $scope.error = null;
  $scope.success = null;
  $scope.loading = false;

  // Redirect if already logged in
  if (AuthService.isLoggedIn()) {
    $location.path('/dashboard');
    return;
  }

  $scope.login = function() {
    if (!$scope.loginData.email || !$scope.loginData.password) {
      $scope.error = 'Please fill in all fields.';
      return;
    }

    $scope.loading = true;
    $scope.error = null;

    AuthService.login($scope.loginData)
      .then(function(response) {
        AuthService.saveAuth(response.data.data);
        $scope.loading = false;
        $location.path('/dashboard');
      })
      .catch(function(error) {
        $scope.error = (error.data && error.data.message) || 'Login failed. Please try again.';
        $scope.loading = false;
      });
  };

  $scope.register = function() {
    if (!$scope.registerData.username || !$scope.registerData.email || !$scope.registerData.password) {
      $scope.error = 'Please fill in all required fields.';
      return;
    }

    if ($scope.registerData.password.length < 6) {
      $scope.error = 'Password must be at least 6 characters.';
      return;
    }

    $scope.loading = true;
    $scope.error = null;

    AuthService.register($scope.registerData)
      .then(function(response) {
        AuthService.saveAuth(response.data.data);
        $scope.loading = false;
        $location.path('/dashboard');
      })
      .catch(function(error) {
        $scope.error = (error.data && error.data.message) || 'Registration failed. Please try again.';
        $scope.loading = false;
      });
  };
}]);
