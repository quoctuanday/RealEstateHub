const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

router.put('/update/:id', categoryController.update);
router.get('/get', categoryController.get);
router.post('/create', categoryController.create);

module.exports = router;
