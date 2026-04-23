const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title must be at most 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt must be at most 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Science', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  coverImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comment count
postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post'
});

// Auto-generate excerpt from content if not provided
postSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...';
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
