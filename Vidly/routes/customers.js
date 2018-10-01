const auth = require('../middleware/auth');
const {Customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Retrieves all of the genres from the array
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers);
});

router.get('/:id', async(req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) {
        res.status(404).send('The genre with the given ID was not found.');
        return;
    }
    res.send(customer);
});

router.post('/', auth, async(req, res) => {
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();

    res.send(customer);
});

router.put('/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    }, { new: true });

    if(!customer) {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }
    res.send(customer);
});

router.delete('/:id', auth, async(req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if(!customer) {
        res.status(404).send('The course with the given ID was not found!');
        return;
    }
    res.send(customer);
});

module.exports = router;