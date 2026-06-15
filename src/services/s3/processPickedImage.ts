import { isAwsS3Configured } from '../../config/aws';
import { compressImageForUpload } from '../../utils/compressImage';
import { uploadFileToS3 } from './uploadToS3';

export type ProcessedPickedImage = {
  imageUri: string;
  s3Url: string;
  s3Key: string;
};

export type UploadStatusCallback = (message: string) => void;

export async function processPickedImage(
  sourceUri: string,
  onStatus?: UploadStatusCallback,
): Promise<ProcessedPickedImage> {
  if (!isAwsS3Configured()) {
    throw new Error(
      'AWS S3 is not configured. Add AWS credentials to .env and rebuild the app.',
    );
  }

  onStatus?.('Compressing image...');
  const imageUri = await compressImageForUpload(sourceUri);

  onStatus?.('Uploading to server...');
  const uploadResult = await uploadFileToS3({
    uri: imageUri,
    fileName: `parking_sign_${Date.now()}.jpg`,
    contentType: 'image/jpeg',
  });

  return {
    imageUri,
    s3Url: uploadResult.url,
    s3Key: uploadResult.key,
  };
}
