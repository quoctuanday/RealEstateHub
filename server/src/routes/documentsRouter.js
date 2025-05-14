const express = require('express');
const router = express.Router();
const documentController = require('../controllers/DocumentsController');
const authenticateToken = require('../middleware/auth');
const authorization = require('../middleware/author');

router.get('/', documentController.get);
router.post('/create', documentController.create);
router.delete(
    '/delete/:documentId',
    authenticateToken,
    documentController.delete
);

module.exports = router;
