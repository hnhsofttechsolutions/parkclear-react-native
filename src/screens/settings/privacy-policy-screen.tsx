import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { AppBar } from '../../components/ui/app-bar';
import { Colors } from '../../utils/colors';
import { FlutterStrings } from '../../constants/flutterStrings';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar title={FlutterStrings.privacyPolicy} onBack={() => navigation.goBack()} />
      </View>
      <WebView
        source={{ uri: 'https://parkclear.co/privacy-policy/' }}
        style={{ flex: 1 }}
        startInLoadingState={true}
      />
    </SafeAreaWrapper>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
});
