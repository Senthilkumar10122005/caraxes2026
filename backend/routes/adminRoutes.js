const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

const adminOnly = authMiddleware('admin');

router.get('/stats', adminOnly, adminController.getStats);
router.get('/users', adminOnly, adminController.getUsers);
router.delete('/users/:id', adminOnly, adminController.deleteUser);

router.post('/events', adminOnly, adminController.addEvent);
router.delete('/events/:id', adminOnly, adminController.deleteEvent);

router.get('/bookings', adminOnly, adminController.getBookings);
router.post('/scan', adminOnly, adminController.scanTicket);

module.exports = router;
