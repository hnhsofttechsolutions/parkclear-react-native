import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';

import Toast from 'react-native-toast-message';
import { PATHS } from '../../navigation/paths';
import { ReminderSetScreenProps } from '../../navigation/types';
import { useCancelRemindMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';

const ReminderSetScreen = ({ navigation, route }: ReminderSetScreenProps) => {
  const { reminderMinutes } = route.params;
  const [cancelRemind, { isLoading: cancelRemindLoading }] = useCancelRemindMutation();

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.Dashboard }],
    });
  };

  const handleCancelRemind = async () => {
    try {
      const response = await cancelRemind({}).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Remind Cancelled',
          text2: response?.message,
        });
        handleReset();
      }
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Remind Cancelled Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <SafeAreaWrapper
      backgroundColor={Colors.greenDark}
      statusBarStyle="light-content"
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          <Image
            source={require('../../assets/images/tick-circle.png')}
            style={styles.tickIcon}
          />
          <AppText font="bold" size={24} align="center" color={Colors.white}>
            Reminder Set!
          </AppText>
          <AppText size={16} align="center" color={Colors.white}>
            You&apos;ll receive a notification {reminderMinutes} minutes before
            your parking time expires.
          </AppText>
          <View style={styles.actionsWrapper}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleCancelRemind}
              disabled={cancelRemindLoading}
            >
              {cancelRemindLoading ? (
                <ActivityIndicator color={Colors.black} size="small" />
              ) : (
                <AppText font="medium" size={16} color={Colors.greenDark}>
                  Reset Timer
                </AppText>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.overBtn} onPress={handleReset}>
              <AppText font="medium" size={16} color={Colors.white}>
                Start Over
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ReminderSetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentWrapper: {
    paddingHorizontal: 8,
    gap: 14,
  },
  tickIcon: {
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  actionsWrapper: {
    gap: 14,
  },
  confirmBtn: {
    minHeight: 60,
    borderRadius: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overBtn: {
    minHeight: 60,
    borderRadius: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
});
