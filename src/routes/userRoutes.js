const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Import user model
const user = require('../models/user');

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

// Import jwt for token generation
const jwt = require('jsonwebtoken');
const { response } = require('../../app');

router.get('/', (req, res) => {
    res.send('Healthy User');
})

// Register user
router.post('/register', async (req, res) => {
    const { UserName, Email,CurrentCompany,CurrentPosition,PastCompany,Education,Batch,Course,Description,LinkdinID,ImageLink } = req.body;

    // console.log(req.body);
    try {
        if(!UserName||!Email)
        return res.status(400).json({
            message: 'insufficient data!'
        })
        // Check if user exists
        const userExists = await user.findOne({ Email });
        console.log(userExists);
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new user({
            _id: new mongoose.Types.ObjectId(),
            UserName,
            Email,
            CurrentCompany,
            CurrentPosition,
            PastCompany,
            Education,
            Batch,
            Course,
            Description,
            LinkdinID,
            ImageLink
        });

        // Save user to db
        await newUser.save();
        

        // Generate token
        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        //     expiresIn: 3600
        // });

        // Send token to client
        res.status(200).json({
            // token,
            user: {
                id: newUser._id,
                name: newUser.UserName,
                email: newUser.Email,
                currentCompany: newUser.CurrentCompany,
                currentPosition: newUser.CurrentPosition,
                pastCompany: newUser.PastCompany,
                education:newUser.Education,
                batch:newUser.Batch,
                course:newUser.Course,
                description: newUser.Description,
                linkedinId:newUser.LinkdinID,
                imageLink:newUser.ImageLink
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    }
})

// Login user
router.post('/login', async (req, res) => {
    const { email } = req.body;
    try {
        // Check if user exists
        const userExists = await user.findOne({ Email :email});
        if (!userExists) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        // Check if password is correct
        // const isMatch = await bcrypt.compare(password, userExists.password);
        // if (!isMatch) {
        //     return res.status(400).json({
        //         message: 'Invalid credentials'
        //     });
        // }

        // Generate token
        const token = jwt.sign({ id: userExists._id },`${process.env.JWT_SECRET_KEY}`, {
            expiresIn: 3600
        });
        console.log(userExists);
        // Send token to client
        res.status(200).json({
            token,
            user: {
                id: userExists._id,
                name: userExists.UserName,
                email: userExists.Email
            }
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// Get all user data
router.get('/user', async (req, res) => {
    try {
        // Get user from db

        const userData = await user.find({}).select('-password');

        // Send user data to client
        res.json(userData);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})

// Get user data
router.get('/user/:id', async (req, res) => {
    try {
        // Get user from db
        const userData = await user.findById(req.params.id
        );
        // .select('-password')
        // Send user data to client
        res.json(userData);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})
// Get alluser data leaving a particular id
router.get('/alluser/:id', async (req, res) => {
    try {
        const users = await user.find({ _id: { $ne: req.params.id } }).select([
          "Email",
          "UserName",
          "ImageLink",
          "_id",
        ]);
        return res.json(users);
      } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})
// Edit user data
router.put('/user', async (req, res) => {
    const { name, email } = req.body;
    try {
        // Check if user exists
        const userExists = await user.findById(req.user.id
        );
        if (!userExists) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        // Update user data
        userExists.name = name;
        userExists.email = email;

        // Save user to db
        await userExists.save();
        
        // Send user data to client
        res.json(userExists);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
})


// Export router
module.exports = router;

