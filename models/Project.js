const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  tags: [{ type: String, trim: true }],
  github: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  image: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  date: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
