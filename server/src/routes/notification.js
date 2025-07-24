const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authenticateToken = require('../middleware/auth');

router.put('/update/:id', authenticateToken, NotificationController.update);
router.delete('/delete/:id', authenticateToken, NotificationController.delete);
router.get('/get', authenticateToken, NotificationController.getNotify);

module.exports = router;
