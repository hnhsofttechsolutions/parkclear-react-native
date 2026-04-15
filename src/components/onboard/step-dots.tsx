import { View } from 'react-native';
import { Colors } from '../../utils/colors';

function StepDots({ current }: { current: number }) {
  return (
    <View
      style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1 }}
    >
      {[1, 2, 3].map(i => (
        <View
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 6,
            backgroundColor: current === i ? Colors.primary : Colors.lightGrey,
          }}
        />
      ))}
    </View>
  );
}

export default StepDots;
