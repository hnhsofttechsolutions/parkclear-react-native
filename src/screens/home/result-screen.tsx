import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import NoParkingIcon from '../../assets/images/no_parking.svg';
import YesParkingIcon from '../../assets/images/yes_parking.svg';
import SafeAreaWrapper from '../../components/safe-area-wrapper';
import AppText from '../../components/ui/app-text';

import Sound from 'react-native-sound';
import { useSelector } from 'react-redux';
import RemindCard from '../../components/card/remind-card';
import ReminderModal from '../../components/modals/reminder-modal';
import ResultFeedBack from '../../components/result/result-feedback';
import { PATHS } from '../../navigation/paths';
import { ResultScreenProps } from '../../navigation/types';
import { RootState } from '../../store/store';
import { Colors, Gradient } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';
import ReminderSubcriptionModal from '../../components/modals/reminder-subcription-modal';

const ResultScreen = ({ navigation, route }: ResultScreenProps) => {
  const { id, variant, summarize_message } = route.params;
  const isResolve = variant === 'resolve';
  const [reminderMinutes, setReminderMinutes] = useState(15);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderSubcriptionModal, setReminderSubcriptionModal] =
    useState(false);
  const [hasShownReminder, setHasShownReminder] = useState(false);
  const [isFeedVisible, setIsFeedVisible] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isPaid = user?.is_paid;

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.Dashboard }],
    });
  };

  const handleConfirmReminder = () => {
    setShowReminderModal(true);
  };

  useEffect(() => {
    if (!isResolve) return;
    const sound = new Sound('powerupsuccess.wav', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('Sound load error', error);
        return;
      }
      sound.play(success => {
        if (!success) {
          console.log('Playback failed');
        }
        sound.release();
      });
    });
    return () => {
      sound.release();
    };
  }, [isResolve]);

  useEffect(() => {
    if (!isPaid && !hasShownReminder) {
      const timer = setTimeout(() => {
        setReminderSubcriptionModal(true);
        setHasShownReminder(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPaid, hasShownReminder]);

  return (
    <SafeAreaWrapper
      backgroundColor={isResolve ? Colors.greenDark : Colors.redDark}
      statusBarStyle="light-content"
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={handleReset}
        activeOpacity={0.85}
      >
        <ArrowLeft size={24} color={Gradient.colors[0]} strokeWidth={2.5} />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={styles.iconWrapper}>
            {isResolve ? (
              <YesParkingIcon width={320} height={320} />
            ) : (
              <NoParkingIcon width={320} height={320} />
            )}
          </View>

          <AppText
            font="bold"
            size={20}
            align="center"
            color={Colors.white}
            style={styles.title}
          >
            {isResolve ? 'Permitted Parking' : 'Prohibited Parking'}
          </AppText>

          <Markdown style={markdownStyles}>{summarize_message}</Markdown>

          {isResolve && isPaid && (
            <RemindCard
              reminderMinutes={reminderMinutes}
              setReminderMinutes={setReminderMinutes}
            />
          )}
        </View>
        <View style={styles.actionsWrapper}>
          {isResolve && isPaid && (
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirmReminder}
            >
              <AppText font="medium" size={16} color={Colors.greenDark}>
                CONFIRM
              </AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.overBtn,
              isResolve ? styles.overBtnResolve : styles.overBtnDefault,
            ]}
            onPress={() => setIsFeedVisible(true)}
          >
            <AppText
              font="medium"
              size={16}
              color={isResolve ? Colors.white : Colors.redDark}
            >
              FEEDBACK
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.overBtn,
              isResolve ? styles.overBtnResolve : styles.overBtnDefault,
            ]}
            onPress={handleReset}
          >
            <AppText
              font="medium"
              size={16}
              color={isResolve ? Colors.white : Colors.redDark}
            >
              START OVER
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ResultFeedBack
        id={id}
        isVisible={isFeedVisible}
        setIsVisible={setIsFeedVisible}
      />
      <ReminderModal
        reminderMinutes={reminderMinutes}
        showReminderModal={showReminderModal}
        setShowReminderModal={setShowReminderModal}
      />
      <ReminderSubcriptionModal
        showReminderModal={reminderSubcriptionModal}
        setShowReminderModal={setReminderSubcriptionModal}
      />
    </SafeAreaWrapper>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  menuBtn: {
    width: 48,
    height: 48,
    marginTop: 10,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 10,
  },
  actionsWrapper: {
    paddingBottom: 20,
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
  },
  overBtnResolve: {
    borderWidth: 1.5,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  overBtnDefault: {
    backgroundColor: Colors.white,
  },
});

const markdownStyles = {
  body: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 26,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 20,
    fontFamily: FontFamily.regular,
  },
  list_item: {
    marginTop: 4,
    marginBottom: 4,
  },
};
