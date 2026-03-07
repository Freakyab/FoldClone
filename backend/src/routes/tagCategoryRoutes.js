const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategories,
} = require('../controllers/tagCategoryController');

// Public: get all categories (optional filter by transactionType)
router.get('/', getCategories);
// Seed must be before /:slug to avoid "seed" being treated as slug
router.post('/seed', seedCategories);
// Public: get one category by slug
router.get('/:slug', getCategoryBySlug);

// Mutations (consider protecting with admin middleware later)
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
