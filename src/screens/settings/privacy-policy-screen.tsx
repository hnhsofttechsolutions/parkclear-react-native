import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { Colors } from '../../utils/colors';
import { AppBar } from '../../components/ui/app-bar';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.privacyPolicy}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText color={Colors.headerGrey} style={{ lineHeight: 24 }}>
          {FlutterStrings.privacyPolicyDesc}
        </AppText>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  body: { padding: 20, paddingBottom: 40 },
});
