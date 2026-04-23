/**
 * HomeController — Handles the home page with post listing, search, and category filter
 */
app.controller('HomeController', ['$scope', 'PostService', function($scope, PostService) {
  $scope.posts = [];
  $scope.loading = true;
  $scope.error = null;
  $scope.selectedCategory = 'All';
  $scope.searchQuery = '';
  $scope.categories = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Science'];

  $scope.loadPosts = function() {
    $scope.loading = true;
    $scope.error = null;

    var params = {};
    if ($scope.selectedCategory && $scope.selectedCategory !== 'All') {
      params.category = $scope.selectedCategory;
    }
    if ($scope.searchQuery) {
      params.search = $scope.searchQuery;
    }

    PostService.getPosts(params)
      .then(function(response) {
        $scope.posts = response.data.data;
        $scope.loading = false;
      })
      .catch(function(error) {
        $scope.error = 'Failed to load posts. Please try again.';
        $scope.loading = false;
      });
  };

  $scope.filterByCategory = function(category) {
    $scope.selectedCategory = category;
    $scope.loadPosts();
  };

  $scope.searchPosts = function() {
    $scope.loadPosts();
  };

  $scope.getInitial = function(name) {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  $scope.formatDate = function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Initial load
  $scope.loadPosts();
}]);
