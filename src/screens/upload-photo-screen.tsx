import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { Colors } from '../utils/colors';
import { AppBar } from '../components/ui/app-bar';
import { OutlineButton } from '../components/ui/gradient-button';

const UploadPhotoScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.uploadPhoto}
          onBack={() => navigation.goBack()}
        />
      </View>
      <View style={styles.pad}>
        <AppText align="center" size={17} color={Colors.primary}>
          You’ll need photos to get started. You can add more or make changes
          later.
        </AppText>
        <TouchableOpacity style={styles.dotted} activeOpacity={0.85}>
          <AppText font="medium" size={16} color={Colors.primary}>
            + Add Photos
          </AppText>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <OutlineButton label="Submit" onPress={() => {}} />
      </View>
    </SafeAreaWrapper>
  );
};

export default UploadPhotoScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  pad: { flex: 1, paddingHorizontal: 20, paddingTop: 30, paddingBottom: 30 },
  dotted: {
    marginTop: 20,
    minHeight: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.grey,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
