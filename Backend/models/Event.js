const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide an event category'],
    trim: true,
  },
  maxRegistrations: {
    type: Number,
    required: [true, 'Please provide maximum registrations'],
    min: [1, 'Maximum registrations must be at least 1'],
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
eventSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);