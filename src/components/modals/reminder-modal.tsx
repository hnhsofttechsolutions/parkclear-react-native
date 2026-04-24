import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useResultRemindMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';
import { useNavigation } from '@react-navigation/native';
import { PATHS } from '../../navigation/paths';
import { Cross, X } from 'lucide-react-native';

interface Props {
  showReminderModal: boolean;
  setShowReminderModal: (value: boolean) => void;
  reminderMinutes: number;
}

function ReminderModal({
  showReminderModal,
  setShowReminderModal,
  reminderMinutes,
}: Props) {
  const navigation = useNavigation<any>();
  const [remindApi, { isLoading }] = useResultRemindMutation();

  const handlerConfirm = async () => {
    try {
      const formData = new FormData();
      formData.append('minutes', reminderMinutes);
      const response = await remindApi({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Remind Successful!',
          text2: response?.message,
        });
        setShowReminderModal(false);
        navigation.navigate(PATHS.ReminderSet, { reminderMinutes });
      }
    } catch (error: any) {
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
          <TouchableOpacity onPress={() => setShowReminderModal(false)} style={{ height: 35, width: 35, justifyContent: 'center', alignItems: 'center', alignSelf: "flex-end" }}>
            <X size={24} color={Colors.primary} />
          </TouchableOpacity>
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
            You will be notified {reminderMinutes} minutes before your parking
            time expires.
          </AppText>
          <TouchableOpacity
            style={styles.modalConfirmBtn}
            onPress={handlerConfirm}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <AppText font="medium" size={16} color={Colors.white}>
                Confirm
              </AppText>
            )}
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
