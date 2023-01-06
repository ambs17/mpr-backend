const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Import user model
const user = require('../models/user');

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

// Import jwt for token generation
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('Healthy User');
})

// Register user
const registerUser = async (req, res) => {
    const { UserName, Email, Password,CurrentCompany,CurrentPosition,PastCompany,Education,Batch,Course } = req.body;

    // console.log(req.body);
    try {
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
            Password,
            CurrentCompany,
            CurrentPosition,
            PastCompany,
            Education,
            Batch,
            Course
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
                course:newUser.Course
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    }
}

// Login user
const userLogin = async (req, res) => {
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
}

// Get all user data
const getAllUserData = async (req, res) => {
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
}

// Get user data
const getUserData = async (req, res) => {
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
}

// Edit user data
const editUserData = async (req, res) => {
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
}

const forgotPassword = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if(existingUser) {
            const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
            oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

            // const secret = SECRET_KEY + existingUser.password;
            // const payload = {
            //     email: existingUser.email,
            //     id: existingUser.id
            // }
            // const token = jwt.sign(payload, secret, { expiresIn: '15m' });
            // for production
            // const link = `http://fms-backend-production-ce11.up.railway.app/forgot-password/${existingUser.id}/${token}`;
            // for development
            // const link = `http://localhost:${process.env.PORT}/forgot-password/${existingUser.id}/${token}`;
            // console.log(link);

            const temperoryPassword = randomstring.generate(7);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(temperoryPassword, saltRounds);
            const userPassword = await userModel.findByIdAndUpdate({ _id: existingUser.id }, { password: hashedPassword }, { new: true });

            const sendMail = async () => {
                try {
                    const accessToken = await oAuth2Client.getAccessToken();

                    const transport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            type: 'OAuth2',
                            user: 'tanishcqmehta.dev@gmail.com',
                            clientId: process.env.CLIENT_ID,
                            clientSecret: process.env.CLIENT_SECRET,
                            refreshToken: process.env.REFRESH_TOKEN,
                            accessToken
                        }
                    })

                    const mailOptions = {
                        from: '#name of your company# <tumhari mail jisse bhej rhe ho.com>',
                        to: existingUser.email,
                        subject: `Reset Password for FMS account : ${existingUser.email} `,
                        text: `Your new password is provided below.. Please copy it somewhere to be able to login. You can also reset your password from the app once logged in.\n New Password: ${temperoryPassword}`,
                        html: `<h3 style="color:#330080;">Your new password is provided below.. Please copy it somewhere to be able to login. You can also reset your password from the app once logged in.</h3> <h4><span>New Password: </span> <span style="color:#ff0066;">${temperoryPassword}</span></h4>`
                    }

                    const result = await transport.sendMail(mailOptions);
                    return res.status(200).json({ message: "Please check your email for new password.", result });
                } catch(err) {
                    return res.status(400).json({ message: `Something went wrong! ${err}` });
                }
            };
            sendMail();
        } else {
            res.status(200).json({ message: "User doesn't exists!" });
        }
    } catch (err) {
        res.status(400).json({ message: `Something went wrong! ${err}` });
    }
};

module.exports = { registerUser, userLogin, getAllUserData, getUserData, editUserData, forgotPassword };

