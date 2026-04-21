import { Formik } from 'formik';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { FlutterStrings } from '../../constants/flutterStrings';
import { feedbackSchema } from '../../schema/contactSchema';
import { useResultFeedbackMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import BottomSheetModal from '../bottom-sheet-modal';
import AppText from '../ui/app-text';
import { AppTextField } from '../ui/app-text-field';
import ErrorText from '../ui/error-text';
import { GradientButton } from '../ui/gradient-button';

interface Props {
  id: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

function ResultFeedBack({ id, isVisible, setIsVisible }: Props) {
  const [feedbackApi, { isLoading }] = useResultFeedbackMutation();

  const handleFeedback = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('feedback', values.message);
      const response = await feedbackApi({ formData }).unwrap();
      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Feedback Submitted!',
          text2: response?.message,
        });
        setIsVisible(false);
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
                style={{ fontWeight: '600' }}
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
    </>
  );
}

export default ResultFeedBack;

const styles = StyleSheet.create({
  sheetDescription: {
    marginTop: 12,
    marginBottom: 24,
    lineHeight: 26,
    fontWeight: '400',
  },
});
