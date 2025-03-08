const express = require('express');
const passport = require('passport');
const router = express.Router();
const chatGptController = require('../controllers/ChatGptController');

router.post('/generateTitle', chatGptController.generateTitle);

module.exports = router;
