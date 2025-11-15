const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticateToken = require('../middleware/auth'); // tu middleware JWT


router.get('/me', authenticateToken, reservationController.getMyReservations);

module.exports = router;
