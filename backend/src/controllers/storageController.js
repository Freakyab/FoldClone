const { StatusCodes } = require('http-status-codes');
const { getUploadUrl } = require('../services/s3Service');

function sanitizeFileName(name) {
  return String(name || 'statement.pdf')
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-')
    .slice(0, 128);
}

const getS3UploadUrl = async (req, res, next) => {
  try {
    const { fileName, contentType } = req.body || {};

    if (!fileName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'fileName is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    const safeName = sanitizeFileName(fileName);
    const key = `${req.user.id}/${Date.now()}-${safeName}`;

    const uploadUrl = await getUploadUrl(key, contentType || 'application/pdf');

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        uploadUrl,
        key,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getS3UploadUrl,
};

