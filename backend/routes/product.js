const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Product } = require('../models/product');
const { Category } = require('../models/category');

const api = process.env.API_URL

router.get('/', async (req, res) => {
    const result = await Product.find().populate('category');

    if(!result) return res.status(500).json({success: false, message: 'Oops no products found!'});

    res.send(result);
});

router.get('/:id', async (req, res) => {
    try {
        const result = await Product.findById(req.params.id).populate('category');

        if(!result) return res.status(500).json({success: false, message: 'Oops no products found!'});
    
        res.send(result);
    } catch (err) {
        res.status(500).json({success: false, error: err});
    }
});

router.post('/', async (req, res) => {
    let searchCategory = await Category.findById(req.body.category);
    if (!searchCategory) return res.status(400).json({success: false, message: 'Invalid category!'});

    try {
        let product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category, // category id
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured
        }); 

        product = await product.save();

        if(!product) return res.status(500).json({success: false, message: 'Could not create product.'});

        res.send(product);

    } catch (err) {
        return res.status(500).json({success: false, error: err.message})
    }
});

router.put('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid product id!'});
    }

    let searchCategory = await Category.findById(req.body.category);
    if (!searchCategory) return res.status(400).json({success: false, message: 'Invalid category!'});

    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            }, {new: true}
        );

        if(!updateProduct) return res.status(404).json({success: false, message: 'Can not find product to update.'})

        res.json({success: true, data: updateProduct});

    } catch (err) {
        res.status(500).json({success: false, error: err});
    }
});

router.delete('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid product id!'});
    }
    
    try {
        const deleteProduct = await Product.findByIdAndRemove(req.params.id);   

        if(!deleteProduct) return res.status(404).json({success: false, message: 'Can not fint product to delete.'});

    } catch (err) {
        res.status(500).json({success: false, error: err})
    }
});

module.exports = router;