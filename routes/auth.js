const express = require('express')
const router = express.Router();

const User = require('../models/user')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    // console.log("Request Body for Auth Register :", req.body)
    // res.send(registerValidation(req.body))

    // Validation to check user inputs
    const {error} = registerValidation(req.body)
    if(error) {
        res.send({message: error['details'][0]['message']})
    }

    // Validation to check if the user exists already
    const userExists = await User.findOne({email: req.body.email})
    if (userExists) {
        return res.status(400).send({message: 'User already exists'})
    }

    // Encrypt/decrypt password
    // genSalt generates pseudorandom string that is added to the password. Since hashing always gives the same output for same input so if someone has access to the database, hasing can be defeated
    const salt = await bcryptjs.genSalt(5);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Insert data in collection
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
        //password: req.body.password
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (err) {
        res.status(400).send({message: err})
    }
    
})

router.post('/login', async (req, res) => {
    console.log("Request Body for Auth Login :", req.body)

    // Validation-1 to check user input
    const {error} = loginValidation(req.body)
    if (error) {
        return res.status(400).send({message: error['details'][0]['message']})
    }

    // Validation-2 to check user exists
    const user = await User.findOne({email: req.body.email})
    if (!user) {
        return res.status(400).send({message: 'User does not exist'})
    }

    // Validation-3 to check user password
    const passwordvalidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordvalidation) {
        return res.status(400).send({message: 'Password is wrong'})
    } 
    // else {
    //     res.send('Login SUCCESSFUL')
    // }

    // Generate auth token for giving the authorized user access to everything
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
})

module.exports = router