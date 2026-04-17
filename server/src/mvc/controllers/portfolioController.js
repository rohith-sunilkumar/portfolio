// src/controllers/portfolioController.js
import WorkProject from '../models/WorkProject.js';
import PlaygroundItem from '../models/PlaygroundItem.js';

export const getAllWork = async (req, res) => {
  try {
    const projects = await WorkProject.find().sort({ year: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWorkById = async (req, res) => {
  try {
    const project = await WorkProject.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Work project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllPlayground = async (req, res) => {
  try {
    const items = await PlaygroundItem.find().sort({ year: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPlaygroundById = async (req, res) => {
  try {
    const item = await PlaygroundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Playground item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
