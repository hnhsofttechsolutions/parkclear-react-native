import MaskedView from '@react-native-masked-view/masked-view';
import React, { useState } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Gradient } from '../../utils/colors';
import { FontFamily } from '../../utils/fonts';

const GRADIENT_TEXT_PAD_W = 4;
const GRADIENT_TEXT_PAD_H = 4;

export function GradientText({
  children,
  fontSize = 28,
  style,
}: {
  children: string;
  fontSize?: number;
  style?: ViewStyle;
}) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const textStyle = {
    fontSize,
    fontWeight: '600' as const,
    fontFamily: FontFamily.semiBold,
    includeFontPadding: false,
  };

  const maskW = Math.ceil(size.w) + GRADIENT_TEXT_PAD_W;
  const maskH = Math.ceil(size.h) + GRADIENT_TEXT_PAD_H;

  return (
    <View style={[{ alignSelf: 'center', flexShrink: 0 }, style]}>
      <View
        style={{ position: 'absolute', left: -9999, top: 0, opacity: 0 }}
        pointerEvents="none"
        collapsable={false}
      >
        <Text
          style={textStyle}
          numberOfLines={1}
          onLayout={e => {
            const { width, height } = e.nativeEvent.layout;
            setSize({ w: width, h: height });
          }}
        >
          {children}
        </Text>
      </View>
      {size.w > 0 ? (
        <MaskedView
          style={{ width: maskW, height: maskH }}
          maskElement={
            <View
              style={{
                width: maskW,
                height: maskH,
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  ...textStyle,
                  textAlign: 'center',
                  color: '#000000',
                }}
                numberOfLines={1}
              >
                {children}
              </Text>
            </View>
          }
        >
          <LinearGradient
            colors={[...Gradient.colors]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: maskW, height: maskH }}
          />
        </MaskedView>
      ) : null}
    </View>
  );
}
