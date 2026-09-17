const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    return res.status(500).json({ msg: 'Error fetching database products.' });
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, price, stock } = req.body;
  try {
    const newProduct = new Product({ title, description, price, stock });
    await newProduct.save();
    return res.status(201).json({ success: true, data: newProduct });
  } catch (err) {
    return res.status(500).json({ msg: 'Error registering new database entry.' });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'Database product not found.' });

    await product.deleteOne();
    return res.status(200).json({ success: true, msg: 'Product records purged successfully.' });
  } catch (err) {
    return res.status(500).json({ msg: 'Purge execution collapsed.' });
  }
};