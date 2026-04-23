const Post = require('../models/Post');
const Comment = require('../models/Comment');

/**
 * @desc    Get all posts (with optional category filter)
 * @route   GET /api/posts?category=Technology&page=1&limit=10
 * @access  Public
 */
const getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search } = req.query;
    const query = { published: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'username email bio')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: posts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts.'
    });
  }
};

/**
 * @desc    Get a single post by ID (with comments)
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Get comments for this post
    const comments = await Comment.find({ post: post._id })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { ...post.toObject(), comments }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching post.'
    });
  }
};

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, coverImage } = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      coverImage,
      author: req.user.id
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username email bio');

    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: populatedPost
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating post.'
    });
  }
};

/**
 * @desc    Update a post (author only)
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Authorization: only the author can update
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post.'
      });
    }

    const { title, content, excerpt, category, tags, coverImage, published } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.published = published !== undefined ? published : post.published;

    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username email bio');

    res.json({
      success: true,
      message: 'Post updated successfully!',
      data: updatedPost
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating post.'
    });
  }
};

/**
 * @desc    Delete a post and its comments (author only)
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    // Authorization: only the author can delete
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post.'
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.findByIdAndDelete(post._id);

    res.json({
      success: true,
      message: 'Post and associated comments deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post.'
    });
  }
};

/**
 * @desc    Get posts by the logged-in user (dashboard)
 * @route   GET /api/posts/my/posts
 * @access  Private
 */
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate('author', 'username email bio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your posts.'
    });
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.'
      });
    }

    const comment = await Comment.create({
      body: req.body.body,
      post: post._id,
      author: req.user.id
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');

    res.status(201).json({
      success: true,
      message: 'Comment added!',
      data: populatedComment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error adding comment.'
    });
  }
};

/**
 * @desc    Delete a comment (comment author only)
 * @route   DELETE /api/posts/:id/comments/:commentId
 * @access  Private
 */
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.'
      });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment.'
      });
    }

    await Comment.findByIdAndDelete(comment._id);

    res.json({
      success: true,
      message: 'Comment deleted.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting comment.'
    });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  addComment,
  deleteComment
};
