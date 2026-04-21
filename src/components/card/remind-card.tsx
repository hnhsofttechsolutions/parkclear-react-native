import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../utils/colors';
import AppText from '../ui/app-text';

interface Props {
  reminderMinutes: number;
  setReminderMinutes: (value: number) => void;
}

function RemindCard({ reminderMinutes, setReminderMinutes }: Props) {
  const minMinutes = 1;
  const maxMinutes = 30;

  return (
    <View style={styles.reminderCard}>
      <AppText font="medium" size={16} align="center" color={Colors.white}>
        Remind me before time expires
      </AppText>
      <View style={styles.timePill}>
        <AppText font="bold" size={18} color={Colors.white}>
          {reminderMinutes} min
        </AppText>
      </View>
      <View style={styles.sliderWrap}>
        <Slider
          style={styles.slider}
          minimumValue={minMinutes}
          maximumValue={maxMinutes}
          value={reminderMinutes}
          onValueChange={(value) => setReminderMinutes(Math.round(value))}
          minimumTrackTintColor={Colors.white}
          maximumTrackTintColor="rgba(255,255,255,0.35)"
          thumbTintColor={Colors.greenDark}
        />
      </View>
      <View style={styles.sliderLabels}>
        <AppText font="medium" size={16} color={Colors.white}>
          {minMinutes} min
        </AppText>
        <AppText font="medium" size={16} color={Colors.white}>
          {maxMinutes} min
        </AppText>
      </View>
    </View>
  );
}

export default RemindCard;

const styles = StyleSheet.create({
  reminderCard: {
    marginBottom: 20,
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  timePill: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderWrap: {
    height: 40,
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
