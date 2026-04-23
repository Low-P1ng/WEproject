const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  addComment,
  deleteComment
} = require('../controllers/postController');
const { auth } = require('../middleware/auth');

// GET /api/posts/my/posts — Get logged-in user's posts (must be above /:id)
router.get('/my/posts', auth, getMyPosts);

// GET /api/posts — List all posts (public, with optional filters)
router.get('/', getPosts);

// GET /api/posts/:id — Get single post with comments
router.get('/:id', getPost);

// POST /api/posts — Create a new post (protected)
router.post('/', auth, createPost);

// PUT /api/posts/:id — Update a post (protected, author only)
router.put('/:id', auth, updatePost);

// DELETE /api/posts/:id — Delete a post (protected, author only)
router.delete('/:id', auth, deletePost);

// POST /api/posts/:id/comments — Add a comment (protected)
router.post('/:id/comments', auth, addComment);

// DELETE /api/posts/:id/comments/:commentId — Delete a comment (protected)
router.delete('/:id/comments/:commentId', auth, deleteComment);

module.exports = router;
