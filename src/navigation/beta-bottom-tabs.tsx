import MaskedView from '@react-native-masked-view/masked-view';
import {
  AlarmClock,
  Camera,
  LucideIcon,
  Menu,
  Share2,
  User,
} from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import CameraIcon from '../assets/images/camera.svg';
import HamburgerIcon from '../assets/images/hamburger_menu.svg';
import ProfileIcon from '../assets/images/my_profile_circle.svg';
import ShareIcon from '../assets/images/share_img.svg';
import { Colors, Gradient } from '../utils/colors';
import { shareApp } from '../utils/helpers';

const TAB_SIZE = 56;
const ICON_SIZE = 26;

export const BETA_TABS = {
  Profile: 'BetaProfile',
  Alerts: 'BetaAlerts',
  Menu: 'BetaMenu',
  Share: 'BetaShare',
  Scanner: 'BetaScanner',
} as const;

export type BetaTabName = (typeof BETA_TABS)[keyof typeof BETA_TABS];

const TAB_ORDER: BetaTabName[] = [
  BETA_TABS.Menu,
  BETA_TABS.Alerts,
  BETA_TABS.Scanner,
  BETA_TABS.Share,
  BETA_TABS.Profile,
];

const TAB_SHADOW: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  android: {
    elevation: 4,
  },
  default: {},
}) as ViewStyle;

function GradientLucideIcon({
  Icon,
  size = ICON_SIZE,
  active = false,
}: {
  Icon: LucideIcon;
  size?: number;
  active?: boolean;
}) {
  if (active) {
    return <Icon size={size} color={Colors.white} strokeWidth={2} />;
  }

  return (
    <MaskedView
      style={{ width: size, height: size }}
      maskElement={
        <View style={styles.maskWrap}>
          <Icon size={size} color="#000" strokeWidth={2} />
        </View>
      }
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.darkBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientFill}
      />
    </MaskedView>
  );
}

function TabCircleButton({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  if (active) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.tabButton, TAB_SHADOW]}
      >
        <LinearGradient
          colors={[...Gradient.colors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.primaryButton}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.tabButton, styles.defaultButton, TAB_SHADOW]}
    >
      {children}
    </TouchableOpacity>
  );
}

type BetaCustomTabBarProps = BottomTabBarProps & {
  onOpenDrawer?: () => void;
  onCameraPress?: () => void;
};

export function BetaCustomTabBar({
  state,
  navigation,
  onOpenDrawer,
  onCameraPress,
}: BetaCustomTabBarProps) {
  const insets = useSafeAreaInsets();

  const renderTabIcon = (routeName: BetaTabName, focused: boolean) => {
    switch (routeName) {
      case BETA_TABS.Profile:
        if (focused) {
          return (
            <View style={styles.iconCenter}>
              <GradientLucideIcon Icon={User} active />
            </View>
          );
        }
        return <ProfileIcon width={TAB_SIZE} height={TAB_SIZE} />;
      case BETA_TABS.Alerts:
        return (
          <View style={styles.iconCenter}>
            <GradientLucideIcon Icon={AlarmClock} active={focused} size={28} />
          </View>
        );
      case BETA_TABS.Menu:
        if (focused) {
          return (
            <View style={styles.iconCenter}>
              <GradientLucideIcon Icon={Menu} active />
            </View>
          );
        }
        return <HamburgerIcon width={TAB_SIZE} height={TAB_SIZE} />;
      case BETA_TABS.Share:
        if (focused) {
          return (
            <View style={styles.iconCenter}>
              <GradientLucideIcon Icon={Share2} active />
            </View>
          );
        }
        return <ShareIcon width={TAB_SIZE} height={TAB_SIZE} />;
      case BETA_TABS.Scanner:
        if (focused) {
          return (
            <View style={styles.iconCenter}>
              <GradientLucideIcon Icon={Camera} active />
            </View>
          );
        }
        return <CameraIcon width={TAB_SIZE} height={TAB_SIZE} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {TAB_ORDER.map(routeName => {
        const routeIndex = state.routes.findIndex(
          route => route.name === routeName,
        );
        const focused = state.index === routeIndex;

        const onPress = () => {
          if (routeName === BETA_TABS.Menu) {
            onOpenDrawer?.();
            return;
          }

          if (routeName === BETA_TABS.Scanner) {
            onCameraPress?.();
            return;
          }

          if (routeName === BETA_TABS.Share) {
            shareApp();
            return;
          }

          if (routeIndex === -1) {
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: state.routes[routeIndex].key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        };

        return (
          <TabCircleButton
            key={routeName}
            active={focused}
            onPress={onPress}
          >
            {renderTabIcon(routeName, focused)}
          </TabCircleButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: Colors.white,
    paddingTop: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  tabButton: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: TAB_SIZE / 2,
  },
  defaultButton: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    borderRadius: TAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCenter: {
    width: TAB_SIZE,
    height: TAB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskWrap: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientFill: {
    flex: 1,
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
