import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { FlutterStrings } from '../constants/flutterStrings';
import { Colors, Gradient } from '../utils/colors';
import { AppBar } from '../components/ui/app-bar';

const MyProfileScreen = ({ navigation }: any) => {
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.myProfile}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText
          font="bold"
          size={30}
          color={Colors.primary}
          style={{ fontWeight: '700', marginTop: 8 }}
        >
          Demo User
        </AppText>
        <View style={styles.starRow}>
          <Image
            source={require('../assets/images/star.png')}
            style={{ width: 40, height: 40 }}
          />
          <LinearGradient
            colors={[...Gradient.colors]}
            style={styles.pointsCircle}
          >
            <AppText font="semiBold" size={26} color={Colors.white}>
              0
            </AppText>
          </LinearGradient>
        </View>
        <AppText color={Colors.grey}>
          Earn star points by submitting signs to the community.
        </AppText>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  body: { padding: 20, paddingBottom: 40, gap: 20 },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  pointsCircle: {
    width: 72,
    height: 72,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
