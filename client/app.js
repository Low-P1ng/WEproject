/**
 * DailyTea — AngularJS Application Module
 * Configures routing, HTTP interceptor for JWT, and root scope helpers.
 */
var app = angular.module('blogApp', ['ngRoute', 'ngSanitize']);

// --- Route Configuration ---
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'AuthController'
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'AuthController'
    })
    .when('/posts/:id', {
      templateUrl: 'views/post-detail.html',
      controller: 'PostController'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
      resolve: {
        auth: ['AuthService', '$location', function(AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path('/login');
          }
        }]
      }
    })
    .when('/create', {
      templateUrl: 'views/create-post.html',
      controller: 'DashboardController',
      resolve: {
        auth: ['AuthService', '$location', function(AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path('/login');
          }
        }]
      }
    })
    .when('/edit/:id', {
      templateUrl: 'views/edit-post.html',
      controller: 'DashboardController',
      resolve: {
        auth: ['AuthService', '$location', function(AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path('/login');
          }
        }]
      }
    })
    .otherwise({ redirectTo: '/' });
}]);

// --- HTTP Interceptor for JWT ---
app.factory('AuthInterceptor', ['$q', function($q) {
  return {
    request: function(config) {
      var token = localStorage.getItem('blog_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401) {
        localStorage.removeItem('blog_token');
        localStorage.removeItem('blog_user');
      }
      return $q.reject(response);
    }
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}]);

// --- Root Scope Helpers ---
app.run(['$rootScope', 'AuthService', '$location', function($rootScope, AuthService, $location) {
  $rootScope.isLoggedIn = function() {
    return AuthService.isLoggedIn();
  };

  $rootScope.currentUser = function() {
    return AuthService.getUser();
  };

  $rootScope.logout = function() {
    AuthService.logout();
    $location.path('/');
  };
}]);

// --- Date Filter ---
app.filter('timeAgo', function() {
  return function(dateString) {
    if (!dateString) return '';
    var date = new Date(dateString);
    var now = new Date();
    var seconds = Math.floor((now - date) / 1000);

    var intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];

    for (var i = 0; i < intervals.length; i++) {
      var count = Math.floor(seconds / intervals[i].seconds);
      if (count >= 1) {
        return count + ' ' + intervals[i].label + (count > 1 ? 's' : '') + ' ago';
      }
    }
    return 'just now';
  };
});

// --- Truncate Filter ---
app.filter('truncate', function() {
  return function(text, length) {
    if (!text) return '';
    length = length || 150;
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
});
