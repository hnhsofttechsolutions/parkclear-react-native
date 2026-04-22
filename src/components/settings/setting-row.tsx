import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../ui/app-text';
import { Colors } from '../../utils/colors';
import { ChevronRight } from 'lucide-react-native';

function SettingRow({
  icon,
  title,
  onPress,
  showDivider,
}: {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showDivider: boolean;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={styles.settingRow}>
        {icon}
        <AppText
          size={17}
          color={Colors.primary}
          style={{ marginLeft: 15, flex: 1 }}
        >
          {title}
        </AppText>
        <ChevronRight size={15} color={Colors.primary} />
      </View>
      {showDivider ? <View style={styles.settingDivider} /> : null}
    </TouchableOpacity>
  );
}

export default SettingRow;

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  settingDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.textFieldBorder,
  },
});
