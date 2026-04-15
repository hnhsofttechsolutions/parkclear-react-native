import { View } from 'react-native';
import AppText from './app-text';
import { Colors } from '../../utils/colors';
import CallIcon from '../../assets/images/call.svg';

function PhonePrefix() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CallIcon width={22} height={22} />
      <AppText style={{ marginLeft: 10, color: Colors.primary }}>+1</AppText>
    </View>
  );
}

export default PhonePrefix;

