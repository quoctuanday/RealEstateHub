const express = require('express');
const router = express.Router();
const newsController = require('../controllers/NewsController');
const authenticateToken = require('../middleware/auth');
const authorizeRole = require('../middleware/author');

router.get('/getAllNews', newsController.getAllNews);
router.delete(
    '/forceDelete/:newsId',
    authenticateToken,
    newsController.forceDeleteNewsPersonal
);

router.put('/updateNews/:id', authenticateToken, newsController.update);

router.post(
    '/createNews',
    authenticateToken,
    authorizeRole(['admin', 'moderator']),
    newsController.create
);

module.exports = router;
