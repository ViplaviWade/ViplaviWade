const express = require('express')
const router = express.Router()

const Film = require('../models/film')
const verifyToken = require('../verifyToken')
router.get('/', verifyToken, async(req, res) => {
    try {

        const films = await Film.find();
        console.log(".................................",films);
        res.json(films);
        // res.send(films)
    } catch (err) {
        // res.status(400).send({message: err})
        res.status(400).json( {err: 'Internal Server Error'});
    }
})

module.exports = router