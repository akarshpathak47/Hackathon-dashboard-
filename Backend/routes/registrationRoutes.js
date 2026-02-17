const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/my-registrations', protect, getMyRegistrations);
router.get('/event/:eventId', protect, authorize('organizer'), getEventRegistrations);
router.post('/:eventId', protect, registerForEvent);
router.delete('/:eventId', protect, cancelRegistration);

module.exports = router;