const mongoose = require('mongoose');
const validator = require('validator');
// inteface
const MessageSchema = new mongoose.Schema(
    {
        message: {
          text: { type: String, required: true },
        },
        users: Array,
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
      {
        timestamps: true,
      }
);

    // map the schema to the db table
const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;