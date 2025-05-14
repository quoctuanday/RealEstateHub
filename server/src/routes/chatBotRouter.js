const express = require('express');
const router = express.Router();
const chatBotController = require('../controllers/ChatBotController');

router.post('/', chatBotController.chat);

module.exports = router;
