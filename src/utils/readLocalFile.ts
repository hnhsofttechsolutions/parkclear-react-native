import { Buffer } from 'buffer';
import ReactNativeBlobUtil from 'react-native-blob-util';

function toReadablePath(uri: string): string {
  if (uri.startsWith('content://')) {
    return uri;
  }

  if (uri.startsWith('file://')) {
    return decodeURI(uri.replace(/^file:\/\//, ''));
  }

  return uri;
}

export async function readLocalFileAsUint8Array(uri: string): Promise<Uint8Array> {
  const path = toReadablePath(uri);
  const base64 = await ReactNativeBlobUtil.fs.readFile(path, 'base64');
  return new Uint8Array(Buffer.from(base64, 'base64'));
}
