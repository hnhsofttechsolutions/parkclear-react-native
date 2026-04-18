import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../ui/app-text';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description?: string;
}

const DeleteModal = ({
  visible,
  onClose,
  onDelete,
  title,
  description,
}: DeleteModalProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.content}>
            <AppText font="bold" size={20} color="#1A1A1A" align="center">
              {title}
            </AppText>
            {description ? (
              <AppText
                size={14}
                color="#999"
                align="center"
                style={{ marginTop: 10, lineHeight: 20 }}
              >
                {description}
              </AppText>
            ) : null}
          </View>
          <View style={styles.divider} />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AppText font="medium" size={16} color="#007AFF">
                Cancel
              </AppText>
            </TouchableOpacity>
            <View style={styles.verticalDivider} />
            <TouchableOpacity
              style={styles.button}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <AppText font="medium" size={16} color="#FF3B30">
                Yes
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  content: {
    padding: 25,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    height: 55,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
    height: '100%',
  },
});
