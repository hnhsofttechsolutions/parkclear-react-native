import { Image } from 'react-native-compressor';

const COMPRESS_MAX_EDGE = 1024;

export const uploadImagePickerOptions = {
  mediaType: 'photo' as const,
  includeBase64: false,
};

function normalizeInputUri(uri: string): string {
  if (uri.startsWith('file://') || uri.startsWith('content://')) {
    return uri;
  }

  return `file://${uri}`;
}

export async function compressImageForUpload(uri: string): Promise<string> {
  if (!uri?.trim()) {
    throw new Error('Image path is required for compression.');
  }

  return Image.compress(normalizeInputUri(uri), {
    compressionMethod: 'auto',
    maxWidth: COMPRESS_MAX_EDGE,
    maxHeight: COMPRESS_MAX_EDGE,
    quality: 0.75,
    output: 'jpg',
  });
}
