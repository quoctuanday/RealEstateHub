const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticateToken = require('../middleware/auth');
const optionalAuthenticateToken = require('../middleware/optionalAuth');

router.post(
    '/addFavourite',
    authenticateToken,
    postController.addOrRemoveFavourite
);
router.put('/update/:id', authenticateToken, postController.update);
router.get('/getFavourite', authenticateToken, postController.getFavourite);
router.get('/getPost', optionalAuthenticateToken, postController.getPost);
router.post('/create', authenticateToken, postController.create);

module.exports = router;
