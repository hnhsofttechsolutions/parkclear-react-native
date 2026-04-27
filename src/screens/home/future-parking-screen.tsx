import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { CloseButton } from '../../components/ui/close-button';
import { GradientText } from '../../components/ui/gradient-text';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import { GradientButton } from '../../components/ui/gradient-button';

const FutureParkingScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <CloseButton onPress={() => navigation.goBack()} />

        <View style={styles.center}>
          <Image
            source={require('../../assets/images/calendar.png')}
            style={styles.illustration}
          />

          <View style={styles.textWrap}>
            <View style={styles.headingRow}>
              <AppText font="semiBold" size={26} align="center">Want to know if you can </AppText>
            </View>
            <View style={styles.headingRow}>
              <GradientText fontSize={26}>Park</GradientText>
              <AppText font="semiBold" size={26} align="center"> at a future date?</AppText>
            </View>
            <AppText size={16} align="center" style={styles.mt10}>
              Choose any Day and Time!
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <GradientButton
            label="Upload A Sign Photo"
            onPress={() => navigation.replace(PATHS.Camera)}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default FutureParkingScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  illustration: {
    width: 340,
    height: 340,
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
  actions: { marginTop: 20 },
});
