import { X } from 'lucide-react-native';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { usePaywall } from '../../hooks/use-paywall';
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
  const onClose = () => {
    setShowReminderModal(false);
  };

  const { openPaywall, isProfileLoading } = usePaywall({ onClose });

  return (
    <>
      <PageLoader visible={isProfileLoading} />
      <Modal
        animationType="fade"
        transparent
        visible={showReminderModal}
        onRequestClose={() => setShowReminderModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowReminderModal(false)}
              hitSlop={10}
            >
              <X size={22} color={Colors.grey} />
            </TouchableOpacity>
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
            <TouchableOpacity onPress={openPaywall}>
              <LinearGradient
                colors={['#9AEF8B', '#41B540']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.modalConfirmBtn}
              >
                <AppText font="medium" size={16} color={Colors.white}>
                  Subscribe for $4.99 Monthly
                </AppText>
              </LinearGradient>
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
    width: '100%',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 4,
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
