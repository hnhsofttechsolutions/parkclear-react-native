import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import RegisterSuccess from '../../assets/images/register_success.svg';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import BottomSheetModal from '../bottom-sheet-modal';
import AppText from '../ui/app-text';
import { GradientButton } from '../ui/gradient-button';

interface Props {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  email: string;
}

function RegisterModal({ isVisible, setIsVisible, email }: Props) {
  const navigation = useNavigation<any>();
  return (
    <>
      <BottomSheetModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        disableBackdropClose={true}
      >
        <View style={styles.sheetIconWrap}>
          <RegisterSuccess width={200} height={200} />
        </View>
        <AppText
          font="semiBold"
          size={20}
          color={Colors.primary}
          align="center"
          style={{ fontWeight: '600' }}
        >
          Register Successfully
        </AppText>
        <AppText
          size={16}
          color={Colors.grey}
          align="center"
          style={styles.sheetDescription}
        >
          Check your email to confirm account.
        </AppText>
        <GradientButton
          label="Verify Account"
          onPress={() => navigation.navigate(PATHS.OtpRegister, { email })}
        />
      </BottomSheetModal>
    </>
  );
}

export default RegisterModal;

const styles = StyleSheet.create({
  sheetIconWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetDescription: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 26,
    fontWeight: '400',
  },
});
