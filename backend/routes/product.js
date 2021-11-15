const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');

const api = process.env.API_URL

router.get('/', async (req, res) => {
    const result = await Product.find();

    if(!result) {
        res.status(500).json({
            success: false
        })
    }

    res.send(result);
});

// use .then -catch for async await alternative
router.post('/', (req, res) => {

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    }); 

    product.save()
    .then((newProduct) => {
        console.log(newProduct)
        res.status(200).json(newProduct);
    })
    .catch((err) => {
        console.log(err.message);
        res.status(500).json({
            error: err.message,
            success: false
        })  
    });
});

module.exports = router;