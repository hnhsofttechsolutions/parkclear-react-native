import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import NoParkingIcon from '../assets/images/no_parking.svg';
import YesParkingIcon from '../assets/images/yes_parking.svg';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';

import { PATHS } from '../navigation/paths';
import { ResultScreenProps } from '../navigation/types';
import { Colors, Gradient } from '../utils/colors';

const ResultScreen = ({ navigation, route }: ResultScreenProps) => {
  const { variant, summarize_message } = route.params;
  const isResolve = variant === 'resolve';

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.Dashboard }],
    });
  };

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
        </View>
        <TouchableOpacity style={styles.overBtn} onPress={handleReset}>
          <AppText
            font="medium"
            size={16}
            color={isResolve ? Colors.greenDark : Colors.redDark}
          >
            START OVER
          </AppText>
        </TouchableOpacity>
      </ScrollView>
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
  overBtn: {
    minHeight: 60,
    borderRadius: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const markdownStyles = {
  body: {
    color: Colors.white,
    fontSize: 18,
    lineHeight: 26,
  },
  strong: {
    fontWeight: 'bold' as const,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
  },
  list_item: {
    marginTop: 4,
    marginBottom: 4,
  },
};
