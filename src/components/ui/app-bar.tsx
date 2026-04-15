import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from './app-text';
import BackArrowIcon from '../../assets/images/back_arrow.svg';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

export function AppBar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View>
      <View style={appBarStyles.row}>
        <TouchableOpacity
          onPress={onBack}
          style={appBarStyles.leadWrap}
          hitSlop={12}
          disabled={!onBack}
        >
          {onBack ? (
            <View style={appBarStyles.leadCircle}>
              <BackArrowIcon width={50} height={50} />
            </View>
          ) : (
            <View style={{ width: 56 }} />
          )}
        </TouchableOpacity>
        <AppText
          font="semiBold"
          size={22}
          color={Colors.primary}
          style={appBarStyles.title}
        >
          {title}
        </AppText>
        <View style={{ width: 56 }} />
      </View>
      <View style={appBarStyles.divider} />
    </View>
  );
}

const appBarStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 4,
  },
  leadWrap: { width: 70, alignItems: 'flex-start' },
  leadCircle: {
    borderRadius: 999,
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { flex: 1, textAlign: 'center', fontFamily: FontFamily.semiBold },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.divider,
    marginBottom: 4,
  },
});
