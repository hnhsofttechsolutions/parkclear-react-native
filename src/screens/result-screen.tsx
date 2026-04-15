import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import AppText from '../components/ui/app-text';
import { PATHS } from '../navigation/paths';
import { ResultScreenProps } from '../navigation/types';
import { Colors, Gradient } from '../utils/colors';
import { GradientButton } from '../components/ui/gradient-button';
import YesParkingIcon from '../assets/images/yes_parking.svg';
import NoParkingIcon from '../assets/images/no_parking.svg';

const ResultScreen = ({ navigation, route }: ResultScreenProps) => {
  const { variant, summarize_message } = route.params;
  const isResolve = variant === 'resolve';

  const handleReset = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: PATHS.Home }],
    });
  };

  return (
    <SafeAreaWrapper
      backgroundColor={isResolve ? Colors.greenDark : Colors.redDark}
      statusBarStyle="light-content"
      style={styles.inner}
    >
      <View style={{ marginTop: 8 }}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={handleReset}
          activeOpacity={0.85}
        >
          <ArrowLeft size={24} color={Gradient.colors[0]} strokeWidth={2.5} />
        </TouchableOpacity>
        {isResolve ? (
          <YesParkingIcon width={340} height={340} />
        ) : (
          <NoParkingIcon width={340} height={340} />
        )}
        <AppText font="bold" size={20} align="center" color={Colors.white}>
          {isResolve ? 'Permitted Parking' : 'Prohibited Parking'}
        </AppText>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Markdown style={markdownStyles}>{summarize_message}</Markdown>
        </ScrollView>
      </View>
      <GradientButton
        label="START OVER"
        onPress={handleReset}
        style={styles.cta}
      />
    </SafeAreaWrapper>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: 300,
  },
  cta: {
    marginBottom: 16,
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
