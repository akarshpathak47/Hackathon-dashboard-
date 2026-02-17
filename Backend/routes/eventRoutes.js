const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getEvents);
router.get('/:id', getEvent);
router.get('/organizer/my-events', protect, authorize('organizer'), getMyEvents);
router.post('/', protect, authorize('organizer'), createEvent);
router.put('/:id', protect, authorize('organizer'), updateEvent);
router.delete('/:id', protect, authorize('organizer'), deleteEvent);

module.exports = router;