import { Formik } from 'formik';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import TickCircleIcon from '../../assets/images/tick-circle.svg';
import { FlutterStrings } from '../../constants/flutterStrings';
import { feedbackSchema } from '../../schema/contactSchema';
import { useFeedbackMutation } from '../../store/api/settingApi';
import { Colors } from '../../utils/colors';
import BottomSheetModal from '../bottom-sheet-modal';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton } from '../ui/gradient-button';

interface Props {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

function FeedBackForm({ isVisible, setIsVisible }: Props) {
  const [feedbackApi, { isLoading }] = useFeedbackMutation();
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const handleFeedback = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('feedback_message', values.message);
      const response = await feedbackApi({ formData }).unwrap();
      if (response?.status) {
        setIsVisible(false);
        setIsSuccessVisible(true);
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Submission Failed',
        text2: error?.data?.message,
      });
    }
  };

  return (
    <>
      <BottomSheetModal visible={isVisible} onClose={() => setIsVisible(false)}>
        <Formik
          initialValues={{ message: '' }}
          validationSchema={feedbackSchema}
          onSubmit={handleFeedback}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <AppText
                font="semiBold"
                size={20}
                color={Colors.primary}
                align="center"
              >
                {FlutterStrings.feedback}
              </AppText>
              <AppText
                size={16}
                color={Colors.grey}
                align="center"
                style={styles.sheetDescription}
              >
                {FlutterStrings.feedbackDesc}
              </AppText>
              <AppTextField
                label={FlutterStrings.message}
                placeholder={FlutterStrings.writeYourMessage}
                multiline
                onChangeText={handleChange('message')}
                onBlur={handleBlur('message')}
                value={values.message}
              />
              <ErrorText visible={touched.message} error={errors.message} />
              <View style={{ height: 24 }} />
              <GradientButton
                label={FlutterStrings.submit}
                onPress={() => handleSubmit()}
                isLoading={isLoading}
              />
            </>
          )}
        </Formik>
      </BottomSheetModal>

      <Modal
        visible={isSuccessVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.iconContainer}>
              <TickCircleIcon width={60} height={60} />
            </View>
            <AppText font="bold" size={24} color={Colors.primary} align="center">
              Feedback Sent
            </AppText>
            <AppText size={16} color={Colors.grey} align="center" style={{ marginTop: 8 }}>
              Thanks for your feedback.
            </AppText>
            <View style={{ height: 32 }} />
            <GradientButton
              label="Ok"
              onPress={() => setIsSuccessVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

export default FeedBackForm;

const styles = StyleSheet.create({
  sheetDescription: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 26,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 20,
    alignSelf: "center"
  },
});
