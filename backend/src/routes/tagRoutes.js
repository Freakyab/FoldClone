const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
} = require('../controllers/tagController');

router.use(protect);

router.post('/', createTag);
router.get('/', getTags);
router.get('/:id', getTagById);
router.patch('/:id', updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
