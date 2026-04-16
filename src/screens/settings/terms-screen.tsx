import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { AppBar } from '../../components/ui/app-bar';
import { Colors } from '../../utils/colors';

const TermsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar title="Terms & Conditions" onBack={() => navigation.goBack()} />
      </View>
      <WebView
        source={{ uri: 'https://parkclear.co/terms-conditions/' }}
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </SafeAreaWrapper>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
});
