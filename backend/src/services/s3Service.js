const { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET_NAME;

if (!REGION) {
  // eslint-disable-next-line no-console
  console.warn('AWS_REGION is not set. S3 client may not work correctly.');
}

if (!BUCKET) {
  // eslint-disable-next-line no-console
  console.warn('S3_BUCKET_NAME is not set. S3 operations will fail.');
}

const s3 = new S3Client({
  region: REGION,
});

async function getUploadUrl(key, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType || 'application/pdf',
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return uploadUrl;
}

async function getFileBuffer(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  const response = await s3.send(command);

  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

async function deleteObject(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3.send(command);
}

module.exports = {
  getUploadUrl,
  getFileBuffer,
  deleteObject,
};

