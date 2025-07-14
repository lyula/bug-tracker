const mongoose = require('mongoose');
const { Schema } = mongoose;

const BugSubSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'closed', 'complete', 'resolved'], default: 'open' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const RoomSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  roombugs: [BugSubSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Room', RoomSchema);
