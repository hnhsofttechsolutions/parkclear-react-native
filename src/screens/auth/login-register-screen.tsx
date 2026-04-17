import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SignInForm from '../../components/auth/sign-In-form';
import SignUpForm from '../../components/auth/sign-up-form';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { Colors } from '../../utils/colors';

const LoginRegisterScreen = ({ navigation }: any) => {
  const [tab, setTab] = useState<'in' | 'up'>('in');

  return (
    <SafeAreaWrapper style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <AppText
            font="semiBold"
            size={20}
            color={Colors.primary}
            style={{ fontWeight: '600' }}
          >
            {FlutterStrings.parkingMadeSimpleAndClear}
          </AppText>
          <AppText
            color={Colors.grey}
            style={{ marginTop: 5, fontWeight: '400' }}
          >
            {FlutterStrings.getGreatExperienceWithParkClear}
          </AppText>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, tab === 'in' && styles.tabActive]}
              onPress={() => setTab('in')}
              activeOpacity={0.9}
            >
              <AppText
                font="medium"
                size={14}
                color={tab === 'in' ? Colors.primary : Colors.grey}
                style={{ fontWeight: '500' }}
              >
                {FlutterStrings.signIn}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'up' && styles.tabActive]}
              onPress={() => setTab('up')}
              activeOpacity={0.9}
            >
              <AppText
                font="medium"
                size={14}
                color={tab === 'up' ? Colors.primary : Colors.grey}
                style={{ fontWeight: '500' }}
              >
                {FlutterStrings.signUp}
              </AppText>
            </TouchableOpacity>
          </View>
          {tab === 'in' ? (
            <SignInForm navigation={navigation} />
          ) : (
            <SignUpForm navigation={navigation} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default LoginRegisterScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  scroll: { padding: 20, paddingBottom: 48 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBg,
    borderRadius: 50,
    padding: 4,
    marginTop: 35,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 50,
  },
  tabActive: { backgroundColor: Colors.white },
});
