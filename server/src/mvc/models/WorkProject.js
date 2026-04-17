// src/models/WorkProject.js
import mongoose from 'mongoose';

const workProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  year: {
    type: String,
    default: () => new Date().getFullYear().toString()
  },
  tag: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: ''
  },
  client: {
    type: String,
    default: ''
  },
  services: {
    type: [String],
    default: []
  },
  gallery: {
    type: [String],
    default: []
  }
}, { timestamps: true });

const WorkProject = mongoose.model('WorkProject', workProjectSchema);
export default WorkProject;
