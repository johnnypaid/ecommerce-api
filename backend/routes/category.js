const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Category} = require('../models/category');

const api = process.env.API_URL

router.get('/', async (req, res) => {
    const categoryList = await Category.find();

    if(!categoryList) return res.status(404).json({success: false, message: 'No category list found.'});

    res.json({success: true, data: categoryList});
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById({_id: req.params.id});

        if(!category) return res.status(500).json({success: false, message: 'No category with such id..'});

        res.json({success: true, data: category});

    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

router.post('/', async (req, res) => {
    let searchCategory = await Category.findOne({name: req.body.name})
    if (searchCategory) return res.status(400).json({success: false, message: 'Category already exist!'})

    try {
        let category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        }); 
    
        category = await category.save();

        if(!category) return res.status(500).json({success: false, message: 'Could not create category'})

        res.json({success: true, data: category});
        
    } catch (err) {
        return res.status(500).json({success: false, error: err});
    }
});

router.put('/:id', async(req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid product id!'});
    }

    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                icon: req.body.icon,
                color: req.body.color
            }, {new: true}
        );
    
        if(!category) return res.status(400).send('Category could not be created!');
    
        res.json({success: true, data: category});

    } catch (err) {
        return res.status(500).json({success: false, error: err})
    }
});


// using .then .catch
router.delete('/:id', (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid category id!'});
    }

    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({success: true, message: 'The category has been deleted!'})
        } else {
            return res.status(404).json({success: false, message: 'Category not found...'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err })
    });
});

module.exports = router;