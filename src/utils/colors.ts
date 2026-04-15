import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const Colors = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#191D31',
  lightBlue: '#A4C4E5',
  darkBlue: '#2772F1',
  gradientStart: '#24C5FA',
  gradientEnd: '#2772F1',
  grey: '#A7A9B7',
  greyText: '#B0B0B0',
  lightGrey: '#EBECF3',
  tabBg: '#F8F9FB',
  textFieldBorder: '#F3F3F3',
  textFieldBg: '#F1F1F1',
  greyButton: '#EFEFEF',
  greyIcon: '#85889F',
  header: '#2D2D2D',
  headerGrey: '#A7A9B7',
  blue: '#2598F5',
  settingsRed: '#EC4646',
  goldenDark: '#EFB71C',
  cameraBorder: '#7F7F7F',
  divider: '#F4F4F4',
  completedStroke: '#26A6F7',
  indicatorStroke: '#AFD1FA',
  greenDark: '#41B540',
  redDark: '#F62C30',
} as const;

export const Gradient = {
  colors: ['#2776F3', '#25B4F9'] as const,
  locations: [0, 1] as const,
};

declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
      secondary: string;
      success: string;
      error: string;
      muted: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}

export const MyLightTheme: any = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Gradient.colors[0],
    background: Colors.white,
    card: Colors.tabBg,
    text: Colors.primary,
    border: Colors.textFieldBorder,
    notification: Colors.redDark,
    secondary: Colors.greenDark,
    success: Colors.greenDark,
    error: Colors.redDark,
    muted: Colors.grey,
  },
};

export const MyDarkTheme: any = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Gradient.colors[0],
    background: Colors.primary,
    card: Colors.header,
    text: Colors.white,
    border: Colors.headerGrey,
    notification: Colors.redDark,
    secondary: Colors.greenDark,
    success: Colors.greenDark,
    error: Colors.redDark,
    muted: Colors.greyText,
  },
};
