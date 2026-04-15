import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import { GradientButton } from '../../components/ui/gradient-button';
import AppText from '../../components/ui/app-text';
import { FlutterStrings } from '../../constants/flutterStrings';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';

const OtpScreen = ({ navigation }: any) => {
  const [otp, setOtp] = useState('');
  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaWrapper style={styles.safe}>
      <TouchableOpacity
        style={styles.pad}
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
      >
        <AppText
          font="semiBold"
          size={20}
          color={Colors.primary}
          style={{ fontWeight: '600' }}
        >
          {FlutterStrings.pleaseCheckYourMsg}
        </AppText>
        <View style={styles.pinRow}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <View key={i} style={styles.pinCell}>
              <AppText
                font="semiBold"
                size={20}
                color={Colors.primary}
                style={{ fontWeight: '600' }}
              >
                {otp[i] ?? ''}
              </AppText>
            </View>
          ))}
        </View>
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.hiddenInput}
          autoFocus
        />
        <GradientButton
          label={FlutterStrings.verification}
          onPress={() => navigation.navigate(PATHS.Trial)}
          style={{ marginTop: 35 }}
        />
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },
  pad: { flex: 1, padding: 20 },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
    gap: 8,
  },
  pinCell: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0.01,
    left: 0,
    top: 80,
  },
});
