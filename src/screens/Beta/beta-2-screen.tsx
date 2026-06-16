import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { Colors } from '../../utils/colors';

const BETA_2_URL = 'https://street-sense-spark.lovable.app';

const Beta2Screen = () => {
  return (
    <SafeAreaWrapper style={styles.safe} edges={['bottom']}>
      <WebView
        source={{ uri: BETA_2_URL }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </SafeAreaWrapper>
  );
};

export default Beta2Screen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  webview: { flex: 1 },
});
