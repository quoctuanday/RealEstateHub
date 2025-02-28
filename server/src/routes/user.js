const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');

router.put('/updateOne', authenticateToken, userController.update);
router.get('/getUser', authenticateToken, userController.getUser);
router.post('/login', userController.login);
router.post('/createUser', userController.createUser);
router.post('/refreshToken', userController.refreshToken);
router.get('/logout', userController.logOut);

module.exports = router;
