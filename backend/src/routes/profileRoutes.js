const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  deleteProfile,
  changePassword,
} = require('../controllers/profileController');

router.use(protect);

router.get('/', getProfile);
router.patch('/', updateProfile);
router.delete('/', deleteProfile);
router.patch('/change-password', changePassword);

module.exports = router;
