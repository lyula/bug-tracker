const mongoose = require('mongoose');


const BugSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'complete', 'closed'], default: 'open' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bug', BugSchema);
