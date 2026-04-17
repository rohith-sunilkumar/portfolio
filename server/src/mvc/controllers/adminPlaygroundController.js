// src/controllers/adminPlaygroundController.js
import PlaygroundItem from '../models/PlaygroundItem.js';

export const listPlaygroundItems = async (req, res) => {
  try {
    const items = await PlaygroundItem.find().sort({ year: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPlaygroundItem = async (req, res) => {
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

export const addPlaygroundItem = async (req, res) => {
  try {
    const { title, type, image, description, tools, year } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }

    const newItem = await PlaygroundItem.create({
      title,
      type,
      image: image || '',
      description: description || '',
      tools: tools || [],
      year: year || new Date().getFullYear().toString()
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const editPlaygroundItem = async (req, res) => {
  try {
    const updated = await PlaygroundItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Playground item not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removePlaygroundItem = async (req, res) => {
  try {
    const deleted = await PlaygroundItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Playground item not found' });
    }
    res.json({ message: 'Playground item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
