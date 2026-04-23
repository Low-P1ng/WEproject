/**
 * PostController — Handles single post view and comments
 */
app.controller('PostController', ['$scope', '$routeParams', '$location', 'PostService', 'AuthService',
  function($scope, $routeParams, $location, PostService, AuthService) {
    $scope.post = null;
    $scope.comments = [];
    $scope.loading = true;
    $scope.error = null;
    $scope.commentText = '';
    $scope.commentError = null;
    $scope.commentLoading = false;

    $scope.isLoggedIn = AuthService.isLoggedIn;
    $scope.currentUser = AuthService.getUser;

    $scope.loadPost = function() {
      $scope.loading = true;
      PostService.getPost($routeParams.id)
        .then(function(response) {
          $scope.post = response.data.data;
          $scope.comments = response.data.data.comments || [];
          $scope.loading = false;
        })
        .catch(function() {
          $scope.error = 'Post not found.';
          $scope.loading = false;
        });
    };

    $scope.addComment = function() {
      if (!$scope.commentText.trim()) {
        $scope.commentError = 'Please write a comment.';
        return;
      }

      $scope.commentLoading = true;
      $scope.commentError = null;

      PostService.addComment($routeParams.id, { body: $scope.commentText })
        .then(function(response) {
          $scope.comments.unshift(response.data.data);
          $scope.commentText = '';
          $scope.commentLoading = false;
        })
        .catch(function(error) {
          $scope.commentError = (error.data && error.data.message) || 'Failed to add comment.';
          $scope.commentLoading = false;
        });
    };

    $scope.deleteComment = function(commentId) {
      if (!confirm('Delete this comment?')) return;

      PostService.deleteComment($routeParams.id, commentId)
        .then(function() {
          $scope.comments = $scope.comments.filter(function(c) { return c._id !== commentId; });
        })
        .catch(function() {
          alert('Failed to delete comment.');
        });
    };

    $scope.isCommentAuthor = function(comment) {
      var user = AuthService.getUser();
      return user && comment.author && user._id === comment.author._id;
    };

    $scope.isPostAuthor = function() {
      var user = AuthService.getUser();
      return $scope.post && user && $scope.post.author && user._id === $scope.post.author._id;
    };

    $scope.getInitial = function(name) {
      return name ? name.charAt(0).toUpperCase() : '?';
    };

    $scope.formatDate = function(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    };

    $scope.formatContent = function(content) {
      if (!content) return '';
      // Convert markdown-like headers and paragraphs to HTML
      return content
        .replace(/## (.*?)(\n|$)/g, '<h2>$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/- (.*?)(\n|$)/g, '<li>$1</li>')
        .split('\n\n')
        .map(function(p) {
          p = p.trim();
          if (!p || p.startsWith('<h2>') || p.startsWith('<li>')) return p;
          return '<p>' + p + '</p>';
        })
        .join('\n');
    };

    $scope.loadPost();
  }
]);
