const { StatusCodes } = require('http-status-codes');

/**
 * Validates req.body against a Joi schema. On success, replaces req.body with validated value.
 * @param {import('joi').ObjectSchema} schema - Joi schema
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join(', ');
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message,
        errorCode: 'VALIDATION_ERROR',
      });
    }

    req.body = value;
    next();
  };
}

module.exports = validate;
