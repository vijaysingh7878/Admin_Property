const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderId: mongoose.Schema.ObjectId,
  receiverId: {
    type: mongoose.Schema.ObjectId
  },
  message: [
    {
      msg: String,
      senderId: mongoose.Schema.ObjectId,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
});

module.exports = mongoose.model('Chat', chatSchema);
