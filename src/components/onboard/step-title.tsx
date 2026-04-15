import { View } from 'react-native';
import AppText from '../ui/app-text';
import { Colors } from '../../utils/colors';
import { GradientText } from '../ui/gradient-text';

const TITLE_SIZE = 26;

function StepTitle({ step }: { step: 1 | 2 | 3 }) {
  const rowStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'nowrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    maxWidth: '100%' as const,
  };

  const fitTitle = {
    numberOfLines: 1 as const,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.82,
    style: { flexShrink: 1 },
  };

  if (step === 1) {
    return (
      <View style={{ alignItems: 'center', width: '100%' }}>
        <AppText
          font="semiBold"
          size={TITLE_SIZE}
          color={Colors.primary}
          align="center"
          numberOfLines={1}
        >
          Know if you can
        </AppText>
        <View style={rowStyle}>
          <AppText
            font="semiBold"
            size={TITLE_SIZE}
            color={Colors.primary}
            numberOfLines={1}
            style={{ flexShrink: 0 }}
          >
            Park
          </AppText>
          <GradientText fontSize={TITLE_SIZE}>Clear.</GradientText>
        </View>
      </View>
    );
  }
  if (step === 2) {
    return (
      <View style={rowStyle}>
        <AppText
          font="semiBold"
          size={TITLE_SIZE}
          color={Colors.primary}
          {...fitTitle}
        >
          Confused by Parking{' '}
        </AppText>
        <GradientText fontSize={TITLE_SIZE} style={{ flexShrink: 0 }}>
          Signs?
        </GradientText>
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <View style={rowStyle}>
        <AppText
          font="semiBold"
          size={TITLE_SIZE}
          color={Colors.primary}
          {...fitTitle}
        >
          Avoid Parking{' '}
        </AppText>
        <GradientText fontSize={TITLE_SIZE} style={{ flexShrink: 0 }}>
          Tickets!
        </GradientText>
      </View>
    </View>
  );
}

export default StepTitle;
