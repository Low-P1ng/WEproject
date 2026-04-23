/**
 * AuthService — Handles authentication API calls and token management
 */
app.factory('AuthService', ['$http', function($http) {
  var baseUrl = '/api/auth';

  return {
    register: function(userData) {
      return $http.post(baseUrl + '/register', userData);
    },

    login: function(credentials) {
      return $http.post(baseUrl + '/login', credentials);
    },

    getMe: function() {
      return $http.get(baseUrl + '/me');
    },

    saveAuth: function(data) {
      localStorage.setItem('blog_token', data.token);
      localStorage.setItem('blog_user', JSON.stringify(data.user));
    },

    logout: function() {
      localStorage.removeItem('blog_token');
      localStorage.removeItem('blog_user');
    },

    isLoggedIn: function() {
      return !!localStorage.getItem('blog_token');
    },

    getToken: function() {
      return localStorage.getItem('blog_token');
    },

    getUser: function() {
      var user = localStorage.getItem('blog_user');
      return user ? JSON.parse(user) : null;
    }
  };
}]);
