import { Dimensions, View } from 'react-native';
import AppText from '../ui/app-text';
import { Colors } from '../../utils/colors';
import { GradientText } from '../ui/gradient-text';

const TITLE_SIZE = 26;
const { width } = Dimensions.get('screen');

function StepTitle({ step }: { step: 1 | 2 | 3 }) {
  const rowStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'nowrap' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    width: 'auto' as const,
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
      <>
        <AppText
          font="semiBold"
          size={TITLE_SIZE}
          color={Colors.primary}
          {...fitTitle}
          style={{ flexShrink: 0 }}
        >
          Confused by Parking
        </AppText>
        <GradientText fontSize={TITLE_SIZE} style={{ flexShrink: 0 }}>
          Signs?
        </GradientText>
        <AppText
          color={Colors.primary}
          align="center"
          style={{ marginTop: 10 }}
        >
          No more wasted time and frustrations, we’re here to help you Park
          Clear!
        </AppText>
      </>
    );
  }
  if (step === 2) {
    return (
      <>
        <View style={{ ...rowStyle, marginTop: 20 }}>
          <AppText
            font="semiBold"
            size={TITLE_SIZE}
            color={Colors.primary}
            {...fitTitle}
            style={{ flexShrink: 0 }}
          >
            Can I{' '}
          </AppText>
          <GradientText fontSize={TITLE_SIZE} style={{ flexShrink: 0 }}>
            Park
          </GradientText>
          <AppText
            font="semiBold"
            size={TITLE_SIZE}
            color={Colors.primary}
            {...fitTitle}
            style={{ flexShrink: 0 }}
          >
            {' '}
            here next week?
          </AppText>
        </View>
        <AppText color={Colors.primary} align="center">
          Choose any Day and Time!
        </AppText>
        <View style={[rowStyle, { marginTop: 10 }]}>
          <AppText
            font="semiBold"
            size={TITLE_SIZE}
            color={Colors.primary}
            {...fitTitle}
            style={{ flexShrink: 0 }}
          >
            Get Expiration{' '}
          </AppText>
          <GradientText fontSize={TITLE_SIZE} style={{ flexShrink: 0 }}>
            Alerts!
          </GradientText>
        </View>
      </>
    );
  }
  return (
    <>
      <AppText
        font="semiBold"
        size={34}
        color={Colors.primary}
        {...fitTitle}
        style={{ flexShrink: 0 }}
      >
        Avoid Parking
      </AppText>
      <GradientText fontSize={34} style={{ flexShrink: 0 }}>
        Tickets!
      </GradientText>
      <AppText
        color={Colors.primary}
        align="center"
        style={{
          width: width * 0.6,
          alignSelf: 'center',
          marginTop: 10,
        }}
      >
        Get instant “Yes” or “No” answers with AI-Powered Responses.
      </AppText>
    </>
  );
}

export default StepTitle;
