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
  console.time('[processPickedImage] total');
  console.log('[processPickedImage] sourceUri ---->', sourceUri);

  if (!isAwsS3Configured()) {
    console.timeEnd('[processPickedImage] total');
    throw new Error(
      'AWS S3 is not configured. Add AWS credentials to .env and rebuild the app.',
    );
  }

  onStatus?.('Compressing image...');
  console.time('[processPickedImage] compress');
  const imageUri = await compressImageForUpload(sourceUri);
  console.timeEnd('[processPickedImage] compress');
  console.log('[processPickedImage] compressed imageUri ---->', imageUri);

  onStatus?.('Uploading to server...');
  console.time('[processPickedImage] s3-upload');
  const uploadResult = await uploadFileToS3({
    uri: imageUri,
    fileName: `parking_sign_${Date.now()}.jpg`,
    contentType: 'image/jpeg',
  });
  console.timeEnd('[processPickedImage] s3-upload');
  console.log('[processPickedImage] s3Url ---->', uploadResult.url);
  console.log('[processPickedImage] s3Key ---->', uploadResult.key);
  console.timeEnd('[processPickedImage] total');

  return {
    imageUri,
    s3Url: uploadResult.url,
    s3Key: uploadResult.key,
  };
}
