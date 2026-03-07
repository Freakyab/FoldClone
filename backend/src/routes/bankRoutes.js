const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createBank,
  getBanks,
  getBankById,
  updateBank,
  deleteBank,
  setPrimaryBank,
  uploadBankStatement,
  uploadBankStatementFromS3,
} = require('../controllers/bankController');

router.use(protect);

router.post('/', createBank);
router.post('/upload-statement', uploadBankStatement);
router.post('/upload-statement-from-s3', uploadBankStatementFromS3);
router.get('/', getBanks);
router.get('/:id', getBankById);
router.patch('/:id', updateBank);
router.delete('/:id', deleteBank);
router.patch('/:id/set-primary', setPrimaryBank);

module.exports = router;
