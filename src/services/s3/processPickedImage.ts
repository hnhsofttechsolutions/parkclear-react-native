import { compressImageForUpload } from '../../utils/compressImage';
import { uploadFileToS3 } from './uploadToS3';

export type ProcessedPickedImage = {
  imageUri: string;
  s3Url: string;
};

export type UploadStatusCallback = (message: string) => void;

export type PresignedUrlFetcher = () => Promise<{
  presignedUrl: string;
  publicUrl: string;
}>;

export async function processPickedImage(
  sourceUri: string,
  options: {
    onStatus?: UploadStatusCallback;
    getPresignedUrls: PresignedUrlFetcher;
  },
): Promise<ProcessedPickedImage> {
  const { onStatus, getPresignedUrls } = options;

  onStatus?.('Compressing image...');
  const imageUri = await compressImageForUpload(sourceUri);

  onStatus?.('Getting upload URL...');
  const { presignedUrl, publicUrl } = await getPresignedUrls();

  onStatus?.('Uploading to server...');
  const uploadResult = await uploadFileToS3({
    uri: imageUri,
    presignedUrl,
    publicUrl,
    contentType: 'image/jpg',
    onStatus,
  });

  return {
    imageUri,
    s3Url: uploadResult.url,
  };
}
