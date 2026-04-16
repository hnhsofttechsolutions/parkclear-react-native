import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import {
  FlutterAboutUsRich,
  FlutterStrings,
} from '../../constants/flutterStrings';
import { Colors } from '../../utils/colors';
import { AppBar } from '../../components/ui/app-bar';

const AboutUsScreen = ({ navigation }: any) => {
  const R = FlutterAboutUsRich;
  return (
    <SafeAreaWrapper style={styles.safe}>
      <View style={styles.appBarPad}>
        <AppBar
          title={FlutterStrings.aboutUs}
          onBack={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText color={Colors.header}>
          {R.lead}
          <AppText font="semiBold" color={Colors.header}>
            {R.missionTitle}
          </AppText>
        </AppText>
        
        <AppText color={Colors.headerGrey}>
          <AppText font="semiBold" color={Colors.headerGrey}>
            {R.brand}
          </AppText>
          <AppText color={Colors.headerGrey}>{R.p1}</AppText>
        </AppText>
        <AppText color={Colors.headerGrey}>{R.p2}</AppText>
          <AppText color={Colors.headerGrey}>{R.p3}</AppText>
        <AppText>
          <AppText font="semiBold" color={Colors.headerGrey}>
            {R.brand2}
          </AppText>
          <AppText color={Colors.headerGrey}>{R.p4}</AppText>
        </AppText>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  appBarPad: { paddingHorizontal: 20 },
  body: { padding: 20, paddingBottom: 40 },
});
