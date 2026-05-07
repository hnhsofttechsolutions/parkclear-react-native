import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';
import moment from 'moment-timezone';
import Toast from 'react-native-toast-message';
import { PATHS } from '../../navigation/paths';
import { ReminderSetScreenProps } from '../../navigation/types';
import { useCancelRemindMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import { CommonActions } from '@react-navigation/native';

const ReminderSetScreen = ({ navigation, route }: ReminderSetScreenProps) => {
  const { reminderMinutes, parking_end_time_iso, reminder_time_iso } =
    route.params;
  const [cancelRemind, { isLoading: cancelRemindLoading }] =
    useCancelRemindMutation();
  const end_time = moment(parking_end_time_iso).format('hh:mm A');
  const reminder_time = moment(reminder_time_iso).format('hh:mm A');
  const dayName = moment(reminder_time_iso).format('dddd');

  const handleReset = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: PATHS.Dashboard }],
      }),
    );
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
      backgroundColor="transparent"
      statusBarStyle="light-content"
      style={styles.container}
      ignoreStatusBar
    >
      <LinearGradient
        colors={['#9AEF8B', '#41B540']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
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

          <View style={styles.divider} />

          <View style={styles.timeSection}>
            <AppText size={16} align="center" color={Colors.white}>
              Parking until
            </AppText>
            <View style={styles.timePill}>
              <AppText font="medium" size={42} color={Colors.white}>
                {end_time}
              </AppText>
            </View>
            <AppText
              font="medium"
              size={16}
              color={Colors.white}
              align="center"
            >
              🔔 Reminder at {dayName} {reminder_time}
            </AppText>
          </View>

          <View style={styles.actionsWrapper}>
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleCancelRemind}
              disabled={cancelRemindLoading}
            >
              {cancelRemindLoading ? (
                <ActivityIndicator color={Colors.greenDark} size="small" />
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
    gap: 20,
  },
  tickIcon: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
    marginVertical: 10,
  },
  timeSection: {
    gap: 15,
    alignItems: 'center',
  },
  timePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionsWrapper: {
    gap: 14,
    marginTop: 20,
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
