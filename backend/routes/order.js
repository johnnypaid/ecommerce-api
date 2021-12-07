const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const OrderItems = require('../models/order-items');

router.post('/', async (req, res) => {
    // console.log(req.body);
    try {
        // combine all orders using promise.all
        const orderIdItems = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItems({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        }));

        const orderIdItemsResolve = await orderIdItems;

        console.log(orderIdItemsResolve);

        let order = new Order({
            orderItems: orderIdItemsResolve,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
            user: req.body.user
        }); 
    
        order = await order.save();

        if(!order) return res.status(500).json({success: false, message: 'Could not create order.'})

        res.json({success: true, data: order});
        
    } catch (err) {
        return res.status(500).json({success: false , error: err.message});
    }
})

module.exports = router;