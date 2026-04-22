import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { usePaywall } from '../../hooks/use-paywall';
import { useLazyGetProfileQuery } from '../../store/api/settingApi';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';
import PageLoader from '../ui/page-loader';

interface Props {
  showReminderModal: boolean;
  setShowReminderModal: (value: boolean) => void;
}

function ReminderSubcriptionModal({
  showReminderModal,
  setShowReminderModal,
}: Props) {
  const [triggerGetProfile, { isLoading }] = useLazyGetProfileQuery();

  const onClose = () => {
    setShowReminderModal(false);
  };

  const { openPaywall } = usePaywall({
    onClose,
    triggerGetProfile,
  });

  return (
    <>
      <PageLoader visible={isLoading} />
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
              source={require('../../assets/images/alarm-outline.png')}
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
              Want Parking Reminder?
            </AppText>
            <AppText
              size={16}
              color={Colors.grey}
              align="center"
              style={styles.sheetDescription}
            >
              Unlock full access and Additional Features
            </AppText>
            <TouchableOpacity
              style={styles.modalConfirmBtn}
              onPress={openPaywall}
            >
              <AppText font="medium" size={16} color={Colors.white}>
                Subscribe for $4.99 Monthly
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowReminderModal(false)}
            >
              <AppText font="medium" size={16} color={Colors.greenDark}>
                Cancel Anytime
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default ReminderSubcriptionModal;

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
