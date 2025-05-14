const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const authenticateToken = require('../middleware/auth');

router.post(
    '/addFavourite',
    authenticateToken,
    postController.addOrRemoveFavourite
);
router.put('/update/:id', authenticateToken, postController.update);
router.get('/getPost', authenticateToken, postController.getPost);
router.post('/create', authenticateToken, postController.create);

module.exports = router;
