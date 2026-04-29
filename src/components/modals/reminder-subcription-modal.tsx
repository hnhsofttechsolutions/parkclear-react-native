import { useNavigation } from '@react-navigation/native';
import { X } from 'lucide-react-native';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PATHS } from '../../navigation/paths';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';
import { useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';

interface Props {
  showReminderModal: boolean;
  setShowReminderModal: (value: boolean) => void;
}

function ReminderSubcriptionModal({
  showReminderModal,
  setShowReminderModal,
}: Props) {
  const navigation = useNavigation<any>();
  const [packages, setPackages] = useState<any | null>(null);
  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (
        offerings.current !== null &&
        offerings.current.availablePackages.length !== 0
      ) {
        setPackages(offerings.current.availablePackages[0]);
      }
    } catch (error) {
      console.log('error ----> getRevenue', error);
    }
  };

  return (
    <>
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
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/images/alarm-outline.png')}
                width={40}
                height={40}
                style={{ alignSelf: 'center' }}
              />
            </View>
            <AppText
              font="semiBold"
              size={20}
              color={Colors.primary}
              align="center"
            >
              Want Parking Reminder?
            </AppText>
            <AppText
              size={15}
              color={Colors.grey}
              align="center"
              style={{ marginTop: -8, marginBottom: 40 }}
              // style={styles.sheetDescription}
            >
              Unlock full access and Additional Features
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate(PATHS.Subscription)}
            >
              <LinearGradient
                colors={['#9AEF8B', '#41B540']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.modalConfirmBtn}
              >
                <AppText font="medium" size={16} color={Colors.white}>
                  {`Subscribe for ${packages?.product?.priceString} Monthly`}
                </AppText>
              </LinearGradient>
            </TouchableOpacity>
            <AppText
              color={Colors.grey}
              size={14}
              align="center"
              font="regular"
              style={{ marginTop: -10, marginBottom: 20 }}
            >{`(auto-renewing monthly plan)`}</AppText>
            {/* <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowReminderModal(false)}
            > */}
            <AppText
              align="center"
              font="medium"
              size={16}
              color={Colors.greenDark}
            >
              Cancel Anytime
            </AppText>
            {/* </TouchableOpacity> */}
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
    backgroundColor: '#fff',
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  iconContainer: {
    alignSelf: 'center',
    backgroundColor: '#EAF6EB',
    padding: 10,
    borderRadius: 360,
  },
});
