// src/models/PlaygroundItem.js
import mongoose from 'mongoose';

const playgroundItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  tools: {
    type: [String],
    default: []
  },
  year: {
    type: String,
    default: () => new Date().getFullYear().toString()
  }
}, { timestamps: true });

const PlaygroundItem = mongoose.model('PlaygroundItem', playgroundItemSchema);
export default PlaygroundItem;
