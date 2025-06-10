const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');

router.post('/forgotPassword', userController.forgotPassword);
router.put('/resetPassword/:userId', userController.resetPass);
router.put('/changePassword', authenticateToken, userController.changePassword);
router.put('/updateOne', authenticateToken, userController.update);
router.put('/updateMany', authenticateToken, userController.updateMany);
router.get('/getUser', authenticateToken, userController.getUser);
router.get('/getAllUser', authenticateToken, userController.getAllUsers);
router.post('/login', userController.login);
router.post('/createUser', userController.createUser);
router.post('/refreshToken', userController.refreshToken);
router.get('/logout', userController.logOut);

module.exports = router;
