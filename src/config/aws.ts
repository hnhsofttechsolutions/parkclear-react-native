import Config from 'react-native-config';

const env = Config ?? {};

function readEnv(key: keyof typeof env): string {
  const value = env[key];
  return typeof value === 'string' ? value.trim() : '';
}

export const awsConfig = {
  region: readEnv('AWS_REGION'),
  bucket: readEnv('AWS_S3_BUCKET'),
  accessKeyId: readEnv('AWS_ACCESS_KEY_ID'),
  secretAccessKey: readEnv('AWS_SECRET_ACCESS_KEY'),
  folder: readEnv('AWS_S3_FOLDER') || 'uploads',
  cdnBaseUrl: readEnv('AWS_S3_CDN_URL'),
};

export function isAwsS3Configured(): boolean {
  return Boolean(
    awsConfig.region &&
      awsConfig.bucket &&
      awsConfig.accessKeyId &&
      awsConfig.secretAccessKey,
  );
}

export function getS3PublicUrl(key: string): string {
  const normalizedKey = key.replace(/^\/+/, '');

  if (awsConfig.cdnBaseUrl) {
    return `${awsConfig.cdnBaseUrl.replace(/\/+$/, '')}/${normalizedKey}`;
  }

  return `https://${awsConfig.bucket}.s3.${awsConfig.region}.amazonaws.com/${normalizedKey}`;
}
