const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Import user model
const faculty = require('../models/faculty');
const user = require('../models/user');

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

// Import jwt for token generation
const jwt = require('jsonwebtoken');
//const { response } = require('../../app');

router.get('/', (req, res) => {
    res.send('Healthy Faculty');
})

// Register user
router.post('/register', async (req, res) => {
    const { UserName, Email, Password,Department,Qualification,Position,ImageLink} = req.body;

    // console.log(req.body);
    try {
        if(!UserName||!Email||!Password)
        return res.status(400).json({
            message: 'insufficient data!'
        })
        // Check if user exists
        const facultyExists = await faculty.findOne({ Email });
        console.log(facultyExists);
        if (facultyExists) {
            return res.status(400).json({
                message: 'Faculty already exists!'
            });
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newFaculty = new faculty({
            _id: new mongoose.Types.ObjectId(),
            UserName,
            Email,
            Password,
            Department,
            Qualification,
            Position,
            ImageLink
        });

        // Save user to db
        await newFaculty.save();
        

        // Generate token
        // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        //     expiresIn: 3600
        // });

        // Send token to client
        res.status(200).json({
            // token,
            faculty: {
                id: newFaculty._id,
                name: newFaculty.UserName,
                email: newFaculty.Email,
                department: newFaculty.Department,
                qualification: newFaculty.Qualification,
                position: newFaculty.Position,
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
    const { email, password } = req.body;
    try {
        // Check if user exists
        const userExists = await user({ email });
        if (!userExists) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, userExists.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
            expiresIn: 3600
        });

        // Send token to client
        res.status(200).json({
            token,
            user: {
                id: userExists._id,
                name: userExists.name,
                email: userExists.email
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
router.get('/user?:id', async (req, res) => {
    try {
        // Get user from db
        const userData = await user.findById(req.user.id
        ).select('-password');
        
        // Send user data to client
        res.json(userData);
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

