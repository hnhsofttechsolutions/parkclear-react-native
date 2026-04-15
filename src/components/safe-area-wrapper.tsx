import React from 'react';
import { StatusBar, StyleProp, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../utils/colors';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ReadonlyArray<Edge>;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  ignoreStatusBar?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SafeAreaWrapper = ({
  children,
  edges,
  backgroundColor: bgProp,
  statusBarStyle,
  ignoreStatusBar = false,
  style,
}: SafeAreaWrapperProps) => {
  const backgroundColor = bgProp ?? Colors.white;
  const barStyle = statusBarStyle || 'dark-content';

  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor }, style]}>
      {!ignoreStatusBar ? (
        <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      ) : null}
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
