const express = require('express');
const { addTask, getTasks } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticate, addTask);
router.get('/', authenticate, getTasks);

module.exports = router;
