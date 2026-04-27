import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { CloseButton } from '../components/ui/close-button';
import { GradientButton } from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';
import { Colors } from '../utils/colors';

const UpdateScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <CloseButton onPress={() => navigation.goBack()} />

        <View style={styles.center}>
          <Image
            source={require('../assets/images/calendar.png')}
            style={styles.illustration}
          />
          <View style={styles.textWrap}>
            <View style={styles.headingRow}>
              <AppText font="semiBold" size={26} align="center">We Updated </AppText>
              <GradientText fontSize={26}>ParkClear</GradientText>
              <AppText font="semiBold" size={26} align="center">!</AppText>
            </View>
            <AppText size={18} color={Colors.primary} align="center" style={styles.mt10}>
              Please download the latest version.
            </AppText>
          </View>
        </View>
        <View style={styles.actions}>
          <GradientButton label="Download Now" onPress={() => { }} />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.mt20}>
            <AppText font="medium" size={18} color={Colors.blue} align="center">
              No Thanks
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: {
    width: 320,
    height: 320,
    resizeMode: 'contain',
  },
  textWrap: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  mt10: { marginTop: 10 },
  mt20: { marginTop: 20 },
  actions: { marginTop: 20 },
});
