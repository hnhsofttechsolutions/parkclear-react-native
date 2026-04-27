import { useNavigation } from '@react-navigation/native';
import moment from "moment-timezone";
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { PATHS } from '../../navigation/paths';
import { useResultRemindMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';

interface Props {
  endTimeIso?: string;
  reminderMinutes: number;
  showReminderModal: boolean;
  setShowReminderModal: (value: boolean) => void;
}

function ReminderModal({
  endTimeIso,
  reminderMinutes,
  showReminderModal,
  setShowReminderModal,
}: Props) {
  const navigation = useNavigation<any>();
  const [remindApi, { isLoading }] = useResultRemindMutation();

  const handlerConfirm = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const shortTZ = moment().tz(timezone).format("z");
      const formData = new FormData();
      formData.append('minutes', reminderMinutes);
      formData.append('end_time_iso', endTimeIso);
      formData.append('timezone', shortTZ);
      const response = await remindApi({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Remind Successful!',
          text2: response?.message,
        });
        setShowReminderModal(false);
        navigation.navigate(PATHS.ReminderSet,
          {
            reminderMinutes,
            parking_end_time_iso: response?.parking_end_time_iso,
            reminder_time_iso: response?.reminder_time_iso
          });
      }
    } catch (error: any) {
      setShowReminderModal(false);
      Toast.show({
        type: 'error',
        text1: 'Remind Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={showReminderModal}
      onRequestClose={() => setShowReminderModal(false)}
      statusBarTranslucent
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Image
            source={require('../../assets/images/bell.png')}
            width={40}
            height={40}
            style={{ alignSelf: 'center' }}
          />
          <AppText
            font="semiBold"
            size={20}
            color={Colors.primary}
            align="center"
          >
            Set Reminder?
          </AppText>
          <AppText
            size={16}
            color={Colors.grey}
            align="center"
            style={styles.sheetDescription}
          >
            You will be notified{' '}
            <AppText size={16} color={Colors.greenDark}>
              {reminderMinutes} minutes
            </AppText>{' '}
            before your parking time expires.
          </AppText>

          <TouchableOpacity onPress={handlerConfirm}>
            <LinearGradient
              colors={['#9AEF8B', '#41B540']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.modalConfirmBtn}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <AppText font="medium" size={16} color={Colors.white}>
                  Confirm
                </AppText>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => setShowReminderModal(false)}
          >
            <AppText font="medium" size={16} color={Colors.greenDark}>
              Cancel Reminder
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default ReminderModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingVertical: 30,
    paddingHorizontal: 22,
    gap: 16,
  },
  modalSubtitle: {
    marginBottom: 26,
    lineHeight: 28,
  },
  sheetDescription: {
    lineHeight: 26,
  },
  modalConfirmBtn: {
    minHeight: 52,
    borderRadius: 28,
    backgroundColor: Colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    minHeight: 52,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
