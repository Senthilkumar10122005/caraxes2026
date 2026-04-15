const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware(), bookingController.bookTicket);
router.get('/:booking_id', authMiddleware(), bookingController.getTicket);

module.exports = router;
