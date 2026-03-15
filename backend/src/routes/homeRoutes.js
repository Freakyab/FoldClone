const express = require('express');

const { getHomeDashboard } = require('../controllers/homeController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getHomeDashboard);

module.exports = router;
