const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/auth');

router.put('/update/:id', authenticateToken, NotificationController.update);
router.get('/get', authenticateToken, NotificationController.getNotify);

module.exports = router;
