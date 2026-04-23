/**
 * DashboardController — Handles dashboard, create post, and edit post views
 */
app.controller('DashboardController', ['$scope', '$routeParams', '$location', 'PostService', 'AuthService',
  function($scope, $routeParams, $location, PostService, AuthService) {
    $scope.myPosts = [];
    $scope.loading = true;
    $scope.error = null;
    $scope.success = null;
    $scope.saving = false;

    $scope.categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Science', 'Other'];

    // New/Edit post form model
    $scope.postForm = {
      title: '',
      content: '',
      excerpt: '',
      category: 'Technology',
      tags: '',
      coverImage: ''
    };

    // Load user's posts (dashboard view)
    $scope.loadMyPosts = function() {
      $scope.loading = true;
      PostService.getMyPosts()
        .then(function(response) {
          $scope.myPosts = response.data.data;
          $scope.loading = false;
        })
        .catch(function() {
          $scope.error = 'Failed to load your posts.';
          $scope.loading = false;
        });
    };

    // Load post for editing
    $scope.loadPostForEdit = function() {
      if (!$routeParams.id) return;

      $scope.loading = true;
      PostService.getPost($routeParams.id)
        .then(function(response) {
          var post = response.data.data;
          var user = AuthService.getUser();

          // Check ownership
          if (!user || post.author._id !== user._id) {
            $location.path('/dashboard');
            return;
          }

          $scope.postForm = {
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            category: post.category,
            tags: (post.tags || []).join(', '),
            coverImage: post.coverImage || ''
          };
          $scope.loading = false;
        })
        .catch(function() {
          $scope.error = 'Failed to load post.';
          $scope.loading = false;
        });
    };

    // Create a new post
    $scope.createPost = function() {
      if (!$scope.postForm.title || !$scope.postForm.content) {
        $scope.error = 'Title and content are required.';
        return;
      }

      $scope.saving = true;
      $scope.error = null;

      PostService.createPost($scope.postForm)
        .then(function(response) {
          $scope.saving = false;
          $location.path('/posts/' + response.data.data._id);
        })
        .catch(function(error) {
          $scope.error = (error.data && error.data.message) || 'Failed to create post.';
          $scope.saving = false;
        });
    };

    // Update an existing post
    $scope.updatePost = function() {
      if (!$scope.postForm.title || !$scope.postForm.content) {
        $scope.error = 'Title and content are required.';
        return;
      }

      $scope.saving = true;
      $scope.error = null;

      PostService.updatePost($routeParams.id, $scope.postForm)
        .then(function() {
          $scope.saving = false;
          $location.path('/posts/' + $routeParams.id);
        })
        .catch(function(error) {
          $scope.error = (error.data && error.data.message) || 'Failed to update post.';
          $scope.saving = false;
        });
    };

    // Delete a post
    $scope.deletePost = function(postId) {
      if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

      PostService.deletePost(postId)
        .then(function() {
          $scope.myPosts = $scope.myPosts.filter(function(p) { return p._id !== postId; });
          $scope.success = 'Post deleted successfully.';
        })
        .catch(function() {
          $scope.error = 'Failed to delete post.';
        });
    };

    $scope.formatDate = function(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    };

    $scope.getUser = function() {
      return AuthService.getUser();
    };

    // Determine which view we're on and load appropriate data
    var path = $location.path();
    if (path === '/dashboard') {
      $scope.loadMyPosts();
    } else if (path.startsWith('/edit/')) {
      $scope.loadPostForEdit();
    } else {
      $scope.loading = false;
    }
  }
]);
