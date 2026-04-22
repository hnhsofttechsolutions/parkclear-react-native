import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../ui/app-text';
import { Colors } from '../../utils/colors';

function SettingsBoxRow({
  icon,
  title,
  suffix,
  danger,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  suffix: React.ReactNode;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        style={[
          styles.box,
          danger && {
            backgroundColor: 'rgba(236, 70, 70, 0.03)',
            borderColor: 'rgba(236, 70, 70, 0.1)',
          },
        ]}
      >
        <View style={styles.boxInner}>
          {icon}
          <AppText
            size={17}
            color={danger ? Colors.settingsRed : Colors.primary}
            style={{ marginLeft: 15, flex: 1 }}
          >
            {title}
          </AppText>
          {suffix}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SettingsBoxRow;

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    borderRadius: 12,
  },
  boxInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 19,
  },
});
