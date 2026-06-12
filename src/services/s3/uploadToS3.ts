import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsConfig, getS3PublicUrl, isAwsS3Configured } from '../../config/aws';
import { readLocalFileAsUint8Array } from '../../utils/readLocalFile';

export type S3UploadParams = {
  uri: string;
  fileName: string;
  contentType?: string;
  folder?: string;
};

export type S3UploadResult = {
  key: string;
  url: string;
  bucket: string;
};

let s3Client: S3Client | null = null;

function buildObjectKey(fileName: string, folder?: string): string {
  const baseFolder = (folder ?? awsConfig.folder).replace(/\/+$/, '');
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

  return `${baseFolder}/${timestamp}-${safeName}`;
}

function getS3Client(): S3Client {
  if (!isAwsS3Configured()) {
    throw new Error(
      'AWS S3 is not configured. Add credentials to your .env file.',
    );
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  return s3Client;
}

async function uploadBodyToS3(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: awsConfig.bucket,
    Key: key,
    ContentType: contentType,
  });

  const presignedUrl = await getSignedUrl(getS3Client(), command, {
    expiresIn: 300,
  });

  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body,
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    throw new Error(
      `S3 upload failed (${response.status}). ${responseText || 'Check AWS credentials and bucket settings.'}`,
    );
  }
}

export async function uploadFileToS3(
  params: S3UploadParams,
): Promise<S3UploadResult> {
  const contentType = params.contentType ?? 'image/jpeg';
  const key = buildObjectKey(params.fileName, params.folder);
  const body = await readLocalFileAsUint8Array(params.uri);

  try {
    await uploadBodyToS3(key, body, contentType);
  } catch (error: any) {
    if (error?.message?.includes('Network request failed')) {
      throw new Error(
        'Network request failed. Check internet connection and AWS .env values, then rebuild the app.',
      );
    }

    throw error;
  }

  return {
    key,
    url: getS3PublicUrl(key),
    bucket: awsConfig.bucket,
  };
}
