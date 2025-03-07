const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticateToken = require('../middleware/auth');

router.post('/create', authenticateToken, postController.create);

module.exports = router;
