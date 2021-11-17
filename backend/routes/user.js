const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {User} = require('../models/user');

router.get('/', async (req, res) => {
    const userList = await User.find().select('-password');

    if(!userList) return res.status(500).json({success: false, message: 'No user list found!'});

    res.send({success: true, data: userList})
})

router.get('/:id', async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({success: false, message: 'Invalid user id!'});
    }

    try {
        const user = await User.findById({_id: req.params.id}).select('-password');

        if(!user) return res.status(500).json({success: false, message: 'No user with such id..'});

        res.json({success: true, data: user});

    } catch (err) {
        return res.status(404).json({success: false, error: err});
    }
});

router.post('/', async (req, res) => {
    const searchUser = await User.findOne({name: req.body.name});
    if (searchUser) return res.status(400).json({success: false, message: 'Username already exist!'});

    const searchUserEmail = await User.findOne({email: req.body.email});
    if (searchUserEmail) return res.status(400).json({success: false, message: 'Email has been used!'});

    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country
        }); 
    
        user = await user.save();

        if(!user) return res.status(500).json({success: false, message: 'Could not create user.'})

        res.json({success: true, data: user});
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, error: err});
    }
})

router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    const secret = process.env.secret;

    if(!user) return res.status(400).json({success: false, message: 'Invalid user.'});

    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
                userName: user.name
            },
            secret,
            {expiresIn: '1d'}
        );
        res.send({success: true, user: user.email, token: token});
    } else {
        return res.status(400).json({success: false, message: 'Invalid user.'});
    }
})

module.exports = router;