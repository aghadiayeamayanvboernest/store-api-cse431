const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const categories = await getDb().collection('categories').find().toArray();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const category = await getDb().collection('categories').findOne({ _id: new ObjectId(id) });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'All fields are required: name, description' });
    }
    const result = await getDb().collection('categories').insertOne({ name, description });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'All fields are required: name, description' });
    }
    const result = await getDb().collection('categories').replaceOne(
      { _id: new ObjectId(id) },
      { name, description }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const result = await getDb().collection('categories').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createCategory, updateCategory, deleteCategory };
