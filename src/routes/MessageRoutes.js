const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// Import Message model
const Messages = require('../models/Message');
// const user = require('../models/user');

// Import bcrypt for password hashing
const bcrypt = require('bcrypt');

// Import jwt for token generation
const jwt = require('jsonwebtoken');
//const { response } = require('../../app');

router.get('/', (req, res) => {
    res.send('Healthy Message');
})

router.post('/addmsg/', async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const data = await Messages.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });

        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
        next(ex);
    }
});

router.post('/getmsg/', async (req, res) => {
    try {
        const { from, to } = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updatedAt: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages);
    } catch (ex) {
        next(ex);
    }
});

// Export router
module.exports = router;