import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../ui/app-text';

function DrawerRow({ icon, label, onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.drawerRow}>
      <View style={styles.iconContainer}>{icon}</View>
      <AppText size={17} color="#FFFFFF" style={styles.rowText}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
export default DrawerRow;

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  drawerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowText: {
    marginLeft: 15,
    fontWeight: '400',
    letterSpacing: 0.3,
  },
});
