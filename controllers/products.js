const { getDb } = require('../db/connect');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const products = await getDb().collection('products').find().toArray();
    res.status(200).json(products);
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
    const product = await getDb().collection('products').findOne({ _id: new ObjectId(id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, rating } = req.body;
    if (!name || !description || !price || !category || !brand || stock === undefined || !rating) {
      return res.status(400).json({ message: 'All fields are required: name, description, price, category, brand, stock, rating' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number' });
    }
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 0 and 5' });
    }
    const result = await getDb().collection('products').insertOne({ name, description, price, category, brand, stock, rating });
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const { name, description, price, category, brand, stock, rating } = req.body;
    if (!name || !description || !price || !category || !brand || stock === undefined || !rating) {
      return res.status(400).json({ message: 'All fields are required: name, description, price, category, brand, stock, rating' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative number' });
    }
    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 0 and 5' });
    }
    const result = await getDb().collection('products').replaceOne(
      { _id: new ObjectId(id) },
      { name, description, price, category, brand, stock, rating }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const result = await getDb().collection('products').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getSingle, createProduct, updateProduct, deleteProduct };
