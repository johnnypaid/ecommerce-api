const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Product} = require('../models/product');
const {Category} = require('../models/category');

const api = process.env.API_URL

router.get('/', async (req, res) => {
    try {
        // query params for category filtering
        // api/v1/products?categories=618f97dbada7be425391783e,61923c4200299030d324643d
        let filter = {};

        if(req.query.categories) {
            filter = {category: req.query.categories.split(',')}
        }
        // end filter

        const result = await Product.find(filter).populate('category');

        if(!result) return res.status(500).json({success: false, message: 'Oops no products found!'});

        res.send(result);
        
    } catch (err) {
        return res.status(400).json({success: false,error: err.message});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const result = await Product.findById(req.params.id).populate('category');

        if(!result) return res.status(500).json({success: false, message: 'Oops no products found!'});
    
        res.send(result);
    } catch (err) {
        res.status(500).json({success: false, error: err});
    }
})

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
})

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
})

router.delete('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid product id!'});
    }
    
    try {
        const deleteProduct = await Product.findByIdAndRemove(req.params.id);   

        if(!deleteProduct) return res.status(404).json({success: false, message: 'Can not find product to delete.'});

        res.send({success: true, message: 'Product deleted successfully.'});

    } catch (err) {
        res.status(500).json({success: false, error: err})
    }
})

// statisctics - product count
router.get('/get/count', async (req, res) => {
    try {
        const productCount = await Product.countDocuments({});

        if(!productCount) {
            return res.status(500).json(
                {
                    success: false, 
                    message: 'Cannot find any product.'
                });
        } 

        res.send({success: true, count: productCount});

    } catch (err) {
        res.status(500).json({success: false, error: err.message})
    }
    
})

// statisctics - isFeatured product
router.get('/get/featured/:count', async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const featuredProduct = await Product.find({isFeatured: true}).limit(+count);

        if(!featuredProduct) {
            return res.status(500).json(
                {
                    success: false, 
                    message: 'No featured product.'
                });
        } 

        res.send({success: true, data: featuredProduct});

    } catch (err) {
        res.status(500).json({success: false, error: err.message})
    }
    
})

module.exports = router;