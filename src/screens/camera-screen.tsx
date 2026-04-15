import React from 'react';
import { StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { Colors } from '../utils/colors';
import { AppBar } from '../components/ui/app-bar';
import { GradientButton } from '../components/ui/gradient-button';

const CameraScreen = ({ navigation }: any) => {
  return (
    <View style={styles.root}>
      <SafeAreaWrapper
        edges={['top']}
        style={[styles.topSafe, { flex: 0 }]}
        backgroundColor={Colors.white}
        statusBarStyle="dark-content"
      >
        <AppBar title="Camera" onBack={() => navigation.goBack()} />
      </SafeAreaWrapper>
      <View style={styles.viewfinder}>
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
      </View>
      <AppText
        align="center"
        color={Colors.white}
        style={{ marginBottom: 12, fontWeight: '400' }}
      >
        Live preview (UI only)
      </AppText>
      <GradientButton
        label="Capture"
        onPress={() => {}}
        style={{ marginHorizontal: 24, marginBottom: 24 }}
      />
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1a1a1a' },
  topSafe: { backgroundColor: Colors.white, paddingHorizontal: 20 },
  viewfinder: {
    flex: 1,
    margin: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cameraBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: Colors.white,
  },
  tl: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 12, left: 12, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 12, right: 12, borderBottomWidth: 3, borderRightWidth: 3 },
});
