import React from 'react';
import { Text, TextProps } from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

interface Props extends TextProps {
  children: React.ReactNode;
  size?: number;
  align?: 'left' | 'center' | 'right';
  font?: 'regular' | 'medium' | 'semiBold' | 'bold';
  color?: string;
}
const AppText = ({
  children,
  size = 14,
  align = 'left',
  font = 'regular',
  color,
  style,
  ...props
}: Props) => {
  return (
    <Text
      style={[
        {
          fontSize: size,
          textAlign: align,
          lineHeight: size + 6,
          color: color || Colors.primary,
          fontFamily: FontFamily[font],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export default AppText;
