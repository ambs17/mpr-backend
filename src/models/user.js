const mongoose = require('mongoose');
const validator = require('validator');
// inteface
const userSchema = new mongoose.Schema({
    UserName: {
        type: String,
        //required: true,
        unique: [true, "Username already exists"],
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [20, "Username must be less than 20 characters long"]
    },
    Email: {
        type: String,
        //required: true,
        unique: [true, "Email already exists"],
        // trim: true,
        // lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    Password: {
        type: String,
        //required: true,
        trim: true,
        minlength: [8, "Password must be at least 8 characters long"],
        maxlength: [20, "Password must be less than 20 characters long"]
    },
    CurrentCompany: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Company name must be at least 3 characters long"],
        maxlength: [20, "Company name must be less than 20 characters long"]
    },
    CurrentPosition: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Position name must be at least 3 characters long"],
        maxlength: [20, "Position name must be less than 20 characters long"]
    },
    PastCompany: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Company name must be at least 3 characters long"],
        maxlength: [20, "Company name must be less than 20 characters long"]
    },
    Education: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Education name must be at least 3 characters long"],
        maxlength: [20, "Education name must be less than 20 characters long"]
    },
    Batch: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Batch name must be at least 3 characters long"],
        maxlength: [20, "Batch name must be less than 20 characters long"]
    },
    Course: {
        type: String,
        //required: true,
        trim: true,
        minlength: [3, "Course name must be at least 3 characters long"],
        maxlength: [20, "Course name must be less than 20 characters long"]
    },
    Description: {
        type: String,
        //required: true,
        trim: true,
        maxlength: [256, "Description must be less than 256 characters long"]
    }
    });

    // map the schema to the db table
const user = mongoose.model('User', userSchema);
module.exports = user;