const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();

// Retrieves all of the genres from the array
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name')
    res.send(genres);
});

// Retrieves the information from a specific genre using the ID.
router.get('/:id', async(req, res) => {
    const genre = await Genre.findById(req.params.id);
    if(!genre) {
        res.status(404).send('The genre with the given ID was not found.');
        return;
    }
    res.send(genre);
});

// Creates a new genre and adds it to the list of genres.
router.post('/', auth, async(req, res) => {
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    let genre = new Genre({
        name: req.body.name
    });
    await genre.save();
    res.send(genre);
});

// Updates the genre using the ID to find it.
router.put('/:id', auth, async(req, res) => {
    const { error } = validate(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name}, {
        new: true
    });

    if(!genre) {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }
    res.send(genre);
});

// Deletes a specific genre using its ID.
router.delete('/:id', [auth, admin], async(req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if(!genre) {
        res.status(404).send('The course with the given ID was not found!');
        return;
    }
    res.send(genre);
});

module.exports = router;