const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations/:eventId
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Check if event is full
    const registrationCount = await Registration.countDocuments({
      event: req.params.eventId,
    });

    if (registrationCount >= event.maxRegistrations) {
      return res.status(400).json({
        success: false,
        message: 'Event is full',
      });
    }

    const registration = await Registration.create({
      user: req.user._id,
      event: req.params.eventId,
    });

    // Populate event details
    await registration.populate('event', 'title date location');
    await registration.populate('user', 'name email');

    // Emit real-time update
    if (global.emitRegistrationUpdate) {
      global.emitRegistrationUpdate(req.params.eventId);
    }

    res.status(201).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:eventId
// @access  Private
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.eventId,
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    const eventId = registration.event.toString();
    await registration.deleteOne();

    // Emit real-time update
    if (global.emitRegistrationUpdate) {
      global.emitRegistrationUpdate(eventId);
    }

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/my-registrations
// @access  Private
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get registrations for an event (Organizer only)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations for this event',
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
    })
      .populate('user', 'name email')
      .sort({ registeredAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
