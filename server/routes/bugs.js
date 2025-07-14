
const express = require('express');
const Bug = require('../models/Bug');
const validateBug = require('../utils/validateBug');
const auth = require('../middleware/auth');
const router = express.Router();

// Get a single bug by ID (protected)
router.get('/:id', auth, async (req, res, next) => {
  try {
    const bug = await Bug.findById(req.params.id).populate('creator', 'username');
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    // Only allow access if user is creator or room member/admin
    if (bug.room) {
      const Room = require('../models/Room');
      const room = await Room.findById(bug.room);
      if (!room) return res.status(404).json({ message: 'Room not found' });
      const userId = req.user.id || req.user._id;
      if (
        String(room.admin) !== userId &&
        !room.members.map(m => m.toString()).includes(userId)
      ) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    } else {
      const userId = req.user.id || req.user._id;
      if (bug.creator && bug.creator.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    res.json(bug);
  } catch (err) {
    next(err);
  }
});



// Create a new bug (protected, supports room)
router.post('/', auth, async (req, res, next) => {
  const { isValid, errors } = validateBug(req.body);
  if (!isValid) return res.status(400).json({ errors });
  try {
    const userId = req.user.id || req.user._id;
    const bug = new Bug({
      ...req.body,
      creator: userId,
    });
    await bug.save();
    await bug.populate('creator', 'username');
    res.status(201).json(bug);
  } catch (err) {
    next(err);
  }
});


// Get all bugs (optionally filter by room)
router.get('/', auth, async (req, res, next) => {
  try {
    const { room } = req.query;
    const userId = req.user.id || req.user._id;
    const filter = room ? { room } : { creator: userId, room: null };
    const bugs = await Bug.find(filter).sort({ createdAt: -1 }).populate('creator', 'username');
    res.json(bugs);
  } catch (err) {
    next(err);
  }
});



// Update a bug (protected, only admin can update status in a room)
router.put('/:id', auth, async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) return res.status(404).json({ message: 'Bug not found' });
  // If bug is in a room, only admin can update status
  const userId = req.user.id || req.user._id;
  if (bug.room) {
    const Room = require('../models/Room');
    const room = await Room.findById(bug.room);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (req.body.status && String(room.admin) !== userId) {
      return res.status(403).json({ message: 'Only room admin can update status' });
    }
    // Allow members to update other fields except status
    if (!room.members.map(m => m.toString()).includes(userId)) {
      return res.status(403).json({ message: 'Not a room member' });
    }
  } else {
    // Only creator can update personal bugs
    if (String(bug.creator) !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
  }
  const { isValid, errors } = validateBug({ ...bug.toObject(), ...req.body });
  if (!isValid) return res.status(400).json({ errors });
  Object.assign(bug, req.body);
  await bug.save();
  await bug.populate('creator', 'username');
  res.json(bug);
});


// Delete a bug (protected, only creator or room admin)
router.delete('/:id', auth, async (req, res, next) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) return res.status(404).json({ message: 'Bug not found' });
  const userId = req.user.id || req.user._id;
  if (bug.room) {
    const Room = require('../models/Room');
    const room = await Room.findById(bug.room);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (String(room.admin) !== userId) {
      return res.status(403).json({ message: 'Only room admin can delete bugs' });
    }
  } else {
    if (String(bug.creator) !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
  }
  await bug.deleteOne();
  res.json({ message: 'Bug deleted' });
});

module.exports = router;
