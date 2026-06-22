import ReactNativeBlobUtil from 'react-native-blob-util';
import type { GenerateS3PresignedUrlResponse } from '../../store/api/uploadApi';

const LOG = '[Upload]';

export type S3UploadParams = {
  uri: string;
  presignedUrl: string;
  publicUrl: string;
  contentType?: string;
  onStatus?: (message: string) => void;
};

export type S3UploadResult = {
  url: string;
};

function normalizeUploadPath(uri: string): string {
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return uri;
  }

  return `file://${uri}`;
}

export function parsePresignedUrlResponse(
  response: GenerateS3PresignedUrlResponse,
): { presignedUrl: string; publicUrl: string } {
  const { presigned_put_url, file_url } = response.data ?? {};

  if (typeof presigned_put_url !== 'string' || typeof file_url !== 'string') {
    throw new Error('Could not get upload URL from server.');
  }

  return {
    presignedUrl: presigned_put_url,
    publicUrl: file_url,
  };
}

async function uploadBodyToPresignedUrl(
  presignedUrl: string,
  fileUri: string,
  contentType: string,
): Promise<void> {
  const path = normalizeUploadPath(fileUri);

  const response = await ReactNativeBlobUtil.fetch(
    'PUT',
    presignedUrl,
    {
      'Content-Type': contentType,
    },
    ReactNativeBlobUtil.wrap(path),
  );

  const status = response.info().status;

  if (status !== 200 && status !== 204) {
    const responseText = response.text();
    throw new Error(
      `Upload failed (${status}). ${responseText || 'Please try again.'}`,
    );
  }
}

export async function uploadFileToS3(
  params: S3UploadParams,
): Promise<S3UploadResult> {
  const contentType = params.contentType ?? 'image/jpg';

  params.onStatus?.('Uploading image...');

  try {
    await uploadBodyToPresignedUrl(
      params.presignedUrl,
      params.uri,
      contentType,
    );
  } catch (error: any) {
    if (error?.message?.includes('Network request failed')) {
      throw new Error(
        'Network request failed. Check your internet connection and try again.',
      );
    }

    throw error;
  }

  return { url: params.publicUrl };
}
