const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');
const crypto = require('crypto');
 
// Log all incoming requests to this router for debugging
router.use((req, res, next) => {
  console.log(`[ROOMS ROUTER] ${req.method} ${req.originalUrl} body:`, req.body);
  next();
});

// Update the status of a bug in a room (admin only)
router.patch('/:roomId/bugs/:bugId/status', auth, async (req, res) => {
  const { roomId, bugId } = req.params;
  const { status } = req.body;
  if (!['open', 'in-progress', 'closed', 'complete', 'resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.admin.toString() !== req.user._id) {
    return res.status(403).json({ message: 'Only the admin can update bug status' });
  }
  const bug = room.roombugs.id(bugId);
  if (!bug) return res.status(404).json({ message: 'Bug not found' });
  bug.status = status;
  await room.save();
  res.json(bug);
});

// Delete a room (admin only)
router.delete('/:id', auth, async (req, res) => {
  const room = await Room.findById(req.params.id);
// PUT endpoint for editing a room bug (title/description) by author or admin
router.put('/:roomId/bugs/:bugId', auth, async (req, res) => {
  try {
    const { roomId, bugId } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    // Log all bug IDs and the requested bugId for debugging
    console.log('All roombug IDs in room:', room.roombugs.map(b => b._id && b._id.toString()));
    console.log('Requested bugId:', bugId.toString());
    // Use Mongoose subdocument accessor so changes are tracked
    const bug = room.roombugs.id(bugId);
    if (!bug) {
      return res.status(404).json({ message: 'Bug not found in this room' });
    }
    // Only the bug creator or room admin can edit
    if (
      bug.creator.toString() !== req.user._id.toString() &&
      room.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to edit this bug' });
    }
    bug.title = title;
    bug.description = description;
    await room.save();
    res.json({ message: 'Bug updated', bug });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.admin.toString() !== req.user._id) {
    return res.status(403).json({ message: 'Only the admin can delete this room' });
  }
  await room.deleteOne();
  res.json({ message: 'Room deleted' });
});

// Create a new room
router.post('/create', auth, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Room name required' });
  const code = crypto.randomBytes(4).toString('hex');
  const mongoose = require('mongoose');
  const userId = req.user._id;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const room = new Room({
    name,
    code,
    admin: userId,
    members: [userId],
  });
  await room.save();
  res.status(201).json(room);
});

// Join a room by code
router.post('/join', auth, async (req, res) => {
  const { code } = req.body;
  const room = await Room.findOne({ code });
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (!room.members.map(m => m.toString()).includes(req.user._id)) {
    room.members.push(req.user._id);
    await room.save();
  }
  res.json(room);
});

// List rooms for user
router.get('/my', auth, async (req, res) => {
  const rooms = await Room.find({ members: req.user._id });
  res.json(rooms);
});

// Get room details
router.get('/:id', auth, async (req, res) => {
  const room = await Room.findById(req.params.id).populate('admin', 'username email').populate('members', 'username email');
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});


// Add a bug to a room's roombugs
router.post('/:id/bugs', auth, async (req, res) => {
  const { title, description, status } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  // Only members can add bugs
  if (!room.members.map(m => m.toString()).includes(req.user._id)) {
    return res.status(403).json({ message: 'Not a member of this room' });
  }
  const bug = {
    title,
    description,
    status: status || 'open',
    creator: req.user._id,
    createdAt: new Date()
  };
  room.roombugs.push(bug);
  await room.save();
  // Populate creator for the new bug
  const populatedRoom = await Room.findById(room._id).populate('roombugs.creator', 'username email');
  const newBug = populatedRoom.roombugs[populatedRoom.roombugs.length - 1];
  res.status(201).json(newBug);
});

// Get all bugs from a room's roombugs array
router.get('/:id/bugs', auth, async (req, res) => {
  const room = await Room.findById(req.params.id).populate('roombugs.creator', 'username email');
  if (!room) return res.status(404).json({ message: 'Room not found' });
  // Only members can view bugs
  if (!room.members.map(m => m.toString()).includes(req.user._id)) {
    return res.status(403).json({ message: 'Not a member of this room' });
  }
  res.json(room.roombugs);
});

module.exports = router;
