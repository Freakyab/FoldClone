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
  getSavedStatementPasswords,
  deleteSavedStatementPassword,
} = require('../controllers/bankController');

router.use(protect);

router.post('/', createBank);
router.post('/upload-statement', uploadBankStatement);
router.post('/upload-statement-from-s3', uploadBankStatementFromS3);
router.get('/saved-passwords', getSavedStatementPasswords);
router.delete('/saved-passwords/:id', deleteSavedStatementPassword);
router.get('/', getBanks);
// Parameterized routes must stay after all specific paths (e.g. /saved-passwords)
// so Express does not match /:id before the specific route.
router.get('/:id', getBankById);
router.patch('/:id', updateBank);
router.delete('/:id', deleteBank);
router.patch('/:id/set-primary', setPrimaryBank);

module.exports = router;
