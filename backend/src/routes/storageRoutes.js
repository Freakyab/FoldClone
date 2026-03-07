const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getS3UploadUrl } = require('../controllers/storageController');

router.use(protect);

router.post('/s3-upload-url', getS3UploadUrl);

module.exports = router;

