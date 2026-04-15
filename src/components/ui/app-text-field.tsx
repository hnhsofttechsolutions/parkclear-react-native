import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { Colors } from '../../utils/colors';
import AppText from './app-text';
import { FontFamily } from '../../utils/fonts';

const outfit = {
  regular: FontFamily.regular,
  medium: FontFamily.medium,
  semiBold: FontFamily.semiBold,
  bold: FontFamily.bold,
};

export function AppTextField(
  props: TextInputProps & {
    label?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
  },
) {
  const { label, prefix, suffix, style, multiline, ...rest } = props;
  return (
    <View style={fieldStyles.wrap}>
      {label ? (
        <AppText font="medium" color={Colors.primary} style={fieldStyles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          fieldStyles.row,
          multiline
            ? { minHeight: 100, alignItems: 'flex-start', paddingVertical: 8 }
            : null,
        ]}
      >
        {prefix ? (
          <View
            style={[fieldStyles.prefix, multiline ? { paddingTop: 6 } : null]}
          >
            {prefix}
          </View>
        ) : null}
        <TextInput
          placeholderTextColor={Colors.grey}
          multiline={multiline}
          style={[
            fieldStyles.input,
            multiline ? { minHeight: 88, textAlignVertical: 'top' } : null,
            style,
          ]}
          {...rest}
        />
        {suffix ? <View style={fieldStyles.suffix}>{suffix}</View> : null}
      </View>
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: 4 },
  label: { fontFamily: outfit.medium, marginBottom: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.textFieldBorder,
    borderRadius: 12,
    backgroundColor: Colors.white,
    minHeight: 52,
  },
  prefix: { paddingLeft: 15, paddingRight: 4 },
  suffix: { paddingRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 14,
    color: Colors.primary,
    fontFamily: outfit.regular,
  },
});
