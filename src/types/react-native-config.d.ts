declare module 'react-native-config' {
  export interface NativeConfig {
    AWS_REGION?: string;
    AWS_S3_BUCKET?: string;
    AWS_ACCESS_KEY_ID?: string;
    AWS_SECRET_ACCESS_KEY?: string;
    AWS_S3_FOLDER?: string;
    AWS_S3_CDN_URL?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
