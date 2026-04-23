/**
 * PostService — Handles blog post and comment API calls
 */
app.factory('PostService', ['$http', function($http) {
  var baseUrl = '/api/posts';

  return {
    getPosts: function(params) {
      return $http.get(baseUrl, { params: params });
    },

    getPost: function(id) {
      return $http.get(baseUrl + '/' + id);
    },

    getMyPosts: function() {
      return $http.get(baseUrl + '/my/posts');
    },

    createPost: function(postData) {
      return $http.post(baseUrl, postData);
    },

    updatePost: function(id, postData) {
      return $http.put(baseUrl + '/' + id, postData);
    },

    deletePost: function(id) {
      return $http.delete(baseUrl + '/' + id);
    },

    addComment: function(postId, commentData) {
      return $http.post(baseUrl + '/' + postId + '/comments', commentData);
    },

    deleteComment: function(postId, commentId) {
      return $http.delete(baseUrl + '/' + postId + '/comments/' + commentId);
    }
  };
}]);
