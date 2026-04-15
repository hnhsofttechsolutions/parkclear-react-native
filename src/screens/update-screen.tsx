import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import CancelCircle from '../assets/images/cancel_circle.svg';
import UpdateArt from '../assets/images/ic_subscription.svg';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { Colors, Gradient } from '../utils/colors';
import { GradientButton } from '../components/ui/gradient-button';
import { GradientText } from '../components/ui/gradient-text';

const UpdateScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.pad}>
        <TouchableOpacity
          style={styles.close}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={[...Gradient.colors]}
            style={styles.closeInner}
          >
            <CancelCircle width={28} height={28} />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.illus}>
          <UpdateArt width={220} height={220} />
        </View>
        <AppText
          font="semiBold"
          size={32}
          color={Colors.primary}
          align="center"
          style={{ marginTop: 20, fontWeight: '600' }}
        >
          We Updated{' '}
        </AppText>
        <View style={{ alignSelf: 'center', marginTop: 4 }}>
          <GradientText fontSize={32}>ParkClear</GradientText>
        </View>
        <AppText
          size={17}
          color={Colors.grey}
          align="center"
          style={{ marginTop: 16, paddingHorizontal: 12, fontWeight: '400' }}
        >
          Please update to the latest version for the best experience.
        </AppText>
        <View style={{ flex: 1 }} />
        <GradientButton label={FlutterStrings.downloadNow} onPress={() => {}} />
      </View>
    </SafeAreaWrapper>
  );
};

export default UpdateScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, paddingHorizontal: 20, paddingBottom: 28 },
  close: { alignSelf: 'flex-end' },
  closeInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  illus: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
