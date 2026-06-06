import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ChevronLeft,
  Maximize,
  Minimize,
  Minus,
  Navigation,
  Plus,
  ShieldAlert,
} from 'lucide-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  type Region,
} from 'react-native-maps';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppText from '../../components/ui/app-text';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { useGetZoneScheduleMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import { useCurrentLocation } from '../../utils/useCurrentLocation';
import {
  DEFAULT_CURB_ZONE,
  INITIAL_MAP_REGION,
  MAP_LEGEND,
  SCHEDULE_THEME,
} from './constants';
import {
  geometryToMapCoordinates,
  geometryToPolylines,
  getRegionFromCoordinates,
  getSegmentColor,
  normalizeZoneScheduleResponse,
} from './curb-zone.utils';
import type { CurbSegmentRouteParams, ScheduleItem } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const MAP_CARD_MARGIN = 20;
const MAP_HEIGHT = 250;
const LEGEND_BAR_HEIGHT = 20;
const MAP_CARD_RADIUS = 20;

const EXPAND_CONFIG = {
  duration: 300,
  easing: Easing.out(Easing.cubic),
};

const COLLAPSE_CONFIG = {
  duration: 280,
  easing: Easing.inOut(Easing.cubic),
};

const CurbSegmentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const mapRef = useRef<MapView>(null);
  const mapSlotRef = useRef<View>(null);
  const shouldFollowUserRef = useRef(false);
  const { zone } = (route.params ?? {}) as CurbSegmentRouteParams;
  const insets = useSafeAreaInsets();
  const safeTopInset = useSharedValue(insets.top);

  const selectedZone = zone ?? DEFAULT_CURB_ZONE;
  const zonePolylines = useMemo(
    () => geometryToPolylines(selectedZone.geometry),
    [selectedZone.geometry],
  );
  const zoneCoordinates = useMemo(
    () => geometryToMapCoordinates(selectedZone.geometry),
    [selectedZone.geometry],
  );

  const initialRegion = useMemo<Region>(() => {
    return getRegionFromCoordinates(zoneCoordinates) ?? INITIAL_MAP_REGION;
  }, [zoneCoordinates]);

  const [region, setRegion] = useState<Region>(initialRegion);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [governingRuleText, setGoverningRuleText] = useState<string | null>(
    null,
  );
  const [targetLineColor, setTargetLineColor] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const expandProgress = useSharedValue(0);
  const slotScreenX = useSharedValue(0);
  const slotScreenY = useSharedValue(0);
  const slotW = useSharedValue(SCREEN_WIDTH - MAP_CARD_MARGIN * 2);
  const slotH = useSharedValue(MAP_HEIGHT + LEGEND_BAR_HEIGHT);

  const { hasPermission, requestPermission } = useLocationPermission({
    checkOnlyOnMount: true,
  });
  const { location, fetchLocation } = useCurrentLocation();
  const [getZoneSchedule, { isLoading: isScheduleLoading }] =
    useGetZoneScheduleMutation();

  const segmentColor = targetLineColor ?? getSegmentColor(selectedZone.status);
  const governingRule = governingRuleText ?? null;

  const policyIdsKey = selectedZone.curb_policy_ids.join(',');

  useEffect(() => {
    const fetchSchedule = async () => {
      if (selectedZone.curb_policy_ids.length === 0) {
        setScheduleItems([]);
        return;
      }

      try {
        const response = await getZoneSchedule({
          policy_ids: selectedZone.curb_policy_ids,
        }).unwrap();

        const { governing_rule, target_line_color, schedule } =
          normalizeZoneScheduleResponse(response);

        setScheduleItems(schedule);
        setGoverningRuleText(governing_rule);
        setTargetLineColor(target_line_color);
      } catch (err: any) {
        setScheduleItems([]);
        setTargetLineColor(null);
        Toast.show({
          type: 'error',
          text1: 'Failed to load schedule',
          text2: err?.data?.message ?? 'Something went wrong',
        });
      }
    };

    fetchSchedule();
  }, [getZoneSchedule, policyIdsKey, selectedZone.curb_policy_ids]);

  const fitMapToZone = useCallback(() => {
    if (zoneCoordinates.length < 2) return;

    mapRef.current?.fitToCoordinates(zoneCoordinates, {
      edgePadding: { top: 48, right: 48, bottom: 56, left: 48 },
      animated: true,
    });
  }, [zoneCoordinates]);

  const handleMapSlotLayout = useCallback(
    (width: number, height: number) => {
      slotW.value = width;
      slotH.value = height;
    },
    [slotH, slotW],
  );

  const syncMapSlotBounds = useCallback(
    (onSynced?: () => void) => {
      mapSlotRef.current?.measureInWindow((x, y, width, height) => {
        slotScreenX.value = x;
        slotScreenY.value = y;
        slotW.value = width;
        slotH.value = height;
        onSynced?.();
      });
    },
    [slotH, slotScreenX, slotScreenY, slotW],
  );

  useEffect(() => {
    safeTopInset.value = insets.top;
  }, [insets.top, safeTopInset]);

  useEffect(() => {
    setRegion(initialRegion);
    const fitTimer = setTimeout(fitMapToZone, 350);
    return () => clearTimeout(fitTimer);
  }, [fitMapToZone, initialRegion]);

  const handleZoom = useCallback((factor: number) => {
    setRegion(current => {
      const next = {
        ...current,
        latitudeDelta: current.latitudeDelta * factor,
        longitudeDelta: current.longitudeDelta * factor,
      };
      mapRef.current?.animateToRegion(next, 250);
      return next;
    });
  }, []);

  const handleMyLocation = useCallback(async () => {
    if (hasPermission !== true && !(await requestPermission())) return;
    shouldFollowUserRef.current = true;
    await fetchLocation();
  }, [fetchLocation, hasPermission, requestPermission]);

  const mapShellAnimatedStyle = useAnimatedStyle(() => {
    const progress = expandProgress.value;

    return {
      position: 'absolute',
      top: interpolate(progress, [0, 1], [0, -slotScreenY.value]),
      left: interpolate(progress, [0, 1], [0, -slotScreenX.value]),
      width: interpolate(progress, [0, 1], [slotW.value, SCREEN_WIDTH]),
      height: interpolate(progress, [0, 1], [slotH.value, SCREEN_HEIGHT]),
      borderRadius: interpolate(progress, [0, 1], [MAP_CARD_RADIUS, 0]),
      overflow: 'hidden',
      zIndex: progress > 0.001 ? 300 : 1,
      backgroundColor: Colors.white,
      elevation: progress > 0.001 ? 24 : 2,
    };
  });

  const mapControlsAnimatedStyle = useAnimatedStyle(() => ({
    top: interpolate(
      expandProgress.value,
      [0, 1],
      [12, safeTopInset.value + 12],
    ),
  }));

  const openFullScreenMap = useCallback(() => {
    syncMapSlotBounds(() => {
      setIsMapExpanded(true);
      expandProgress.value = withTiming(1, EXPAND_CONFIG);
    });
  }, [expandProgress, syncMapSlotBounds]);

  const closeFullScreenMap = useCallback(() => {
    syncMapSlotBounds(() => {
      expandProgress.value = withTiming(0, COLLAPSE_CONFIG, finished => {
        if (finished) {
          runOnJS(setIsMapExpanded)(false);
        }
      });
    });
  }, [expandProgress, syncMapSlotBounds]);

  useEffect(() => {
    if (!shouldFollowUserRef.current) return;
    if (location?.latitude == null || location?.longitude == null) return;

    const next = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.004,
      longitudeDelta: 0.004,
    };
    setRegion(next);
    mapRef.current?.animateToRegion(next, 400);
  }, [location?.latitude, location?.longitude]);

  const renderMapControls = (showMinimize: boolean) => (
    <Animated.View style={[styles.mapControls, mapControlsAnimatedStyle]}>
      <TouchableOpacity
        style={styles.mapControlBtn}
        onPress={() => handleZoom(0.7)}
      >
        <Plus size={18} color={Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.mapControlBtn}
        onPress={() => handleZoom(1.3)}
      >
        <Minus size={18} color={Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.mapControlBtn} onPress={handleMyLocation}>
        <Navigation size={18} color={Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.mapControlBtn}
        onPress={showMinimize ? closeFullScreenMap : openFullScreenMap}
      >
        {showMinimize ? (
          <Minimize size={18} color={Colors.primary} />
        ) : (
          <Maximize size={18} color={Colors.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderMapOverlays = () => (
    <>
      {zonePolylines.map((coordinates, index) => (
        <Polyline
          key={`zone-line-${index}`}
          coordinates={coordinates}
          strokeColor={segmentColor}
          strokeWidth={10}
          lineCap="round"
          lineJoin="round"
          geodesic
          zIndex={2}
        />
      ))}
      {zoneCoordinates.length > 0 ? (
        <Marker
          coordinate={zoneCoordinates[Math.floor(zoneCoordinates.length / 2)]}
          pinColor={segmentColor}
          zIndex={3}
        />
      ) : null}
    </>
  );

  const renderScheduleCard = (item: ScheduleItem) => {
    const theme = SCHEDULE_THEME[item.status];
    return (
      <View style={styles.scheduleCard}>
        <View style={styles.scheduleCardBody}>
          <AppText font="bold" size={15} color={Colors.primary}>
            {item.title}
          </AppText>
          <AppText size={13} color={Colors.grey}>
            {item.days}
          </AppText>
          <AppText size={13} color={Colors.grey}>
            {item.time}
          </AppText>
        </View>
        <View
          style={[styles.scheduleBadge, { backgroundColor: theme.badgeBg }]}
        >
          <AppText font="medium" size={12} color={theme.badgeText}>
            {theme.label}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeTop} />
      <StatusBar backgroundColor={Colors.blue} barStyle="light-content" />
      <View style={styles.root}>
        <View style={styles.topSection}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft size={28} color={Colors.darkBlue} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <AppText size={12} color="rgba(255,255,255,0.85)">
                CURB SEGMENT
              </AppText>
              <AppText
                font="bold"
                size={18}
                color={Colors.white}
                numberOfLines={1}
              >
                {selectedZone.street_name}
              </AppText>
            </View>
            {/* <View style={styles.liveBadge}>
              <MapIcon size={14} color={Colors.white} />
              <AppText font="medium" size={12} color={Colors.white}>
                LIVE
              </AppText>
            </View> */}
          </View>

          <View
            ref={mapSlotRef}
            style={[
              styles.mapSlot,
              isMapExpanded ? styles.mapSlotExpanded : null,
            ]}
            onLayout={event => {
              const { width, height } = event.nativeEvent.layout;
              handleMapSlotLayout(width, height);
            }}
          >
            <Animated.View style={mapShellAnimatedStyle} collapsable={false}>
              <View style={styles.mapShellMapArea} collapsable={false}>
                <MapView
                  ref={mapRef}
                  style={StyleSheet.absoluteFill}
                  provider={
                    Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined
                  }
                  mapType={Platform.OS === 'ios' ? 'hybridFlyover' : 'standard'}
                  initialRegion={initialRegion}
                  onMapReady={fitMapToZone}
                  onRegionChangeComplete={setRegion}
                  showsUserLocation={false}
                  showsCompass={false}
                  toolbarEnabled={false}
                  rotateEnabled={false}
                  liteMode={false}
                >
                  {renderMapOverlays()}
                </MapView>
                {renderMapControls(isMapExpanded)}
              </View>

              <View style={styles.legendBar}>
                {MAP_LEGEND.map(item => (
                  <View key={item.key} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <AppText size={12} color={Colors.primary}>
                      {item.label}
                    </AppText>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>

          <AppText
            size={13}
            color="rgba(255,255,255,0.9)"
            align="center"
            style={styles.mapHint}
          >
            Tap color-coded spots to inspect assignments
          </AppText>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetContent}
          >
            <View style={styles.ruleCard}>
              <View style={styles.ruleAccent} />
              <View style={styles.ruleBody}>
                <ShieldAlert size={22} color={Colors.settingsRed} />
                <View style={styles.ruleTextWrap}>
                  <AppText
                    font="medium"
                    size={11}
                    color={Colors.settingsRed}
                    style={styles.ruleLabel}
                  >
                    PRIMARY GOVERNING RULE
                  </AppText>
                  <AppText font="bold" size={16} color={Colors.primary}>
                    {governingRule}
                  </AppText>
                </View>
              </View>
            </View>

            <AppText
              font="medium"
              size={11}
              color={Colors.grey}
              style={styles.scheduleHeading}
            >
              WEEKLY LIVE TARGET SCHEDULE
            </AppText>

            {isScheduleLoading ? (
              <View style={styles.scheduleLoader}>
                <ActivityIndicator color={Colors.darkBlue} />
              </View>
            ) : scheduleItems.length > 0 ? (
              scheduleItems.map((item, index) => (
                <View key={item.id}>
                  {index > 0 ? <View style={styles.scheduleGap} /> : null}
                  {renderScheduleCard(item)}
                </View>
              ))
            ) : (
              <AppText size={14} color={Colors.grey} align="center">
                No schedule found for this zone.
              </AppText>
            )}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default CurbSegmentScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.blue, overflow: 'visible' },
  safeTop: { flex: 0, backgroundColor: Colors.blue },
  topSection: { flex: 1, overflow: 'visible' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: { flex: 1, gap: 2 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  mapSlot: {
    position: 'relative',
    marginHorizontal: MAP_CARD_MARGIN,
    marginTop: 16,
    height: MAP_HEIGHT + LEGEND_BAR_HEIGHT,
    overflow: 'visible',
  },
  mapSlotExpanded: {
    zIndex: 300,
    elevation: 24,
  },
  mapShellMapArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapHint: { marginTop: 14, marginBottom: 12, paddingHorizontal: 24 },
  mapControls: {
    position: 'absolute',
    right: 12,
    top: 12,
    gap: 8,
    overflow: 'hidden',
  },
  mapControlBtn: {
    width: 36,
    height: 36,
    borderRadius: 360,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '46%',
    minHeight: SCREEN_HEIGHT * 0.46,
  },
  sheetHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 28 },
  ruleCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F9D7D7',
    marginBottom: 20,
  },
  ruleAccent: { width: 5, backgroundColor: Colors.settingsRed },
  ruleBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
  },
  ruleTextWrap: { flex: 1, gap: 6 },
  ruleLabel: { letterSpacing: 0.6 },
  scheduleHeading: { letterSpacing: 0.6, marginBottom: 12 },
  scheduleLoader: { paddingVertical: 24, alignItems: 'center' },
  scheduleGap: { height: 12 },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  scheduleCardBody: { flex: 1, gap: 4 },
  scheduleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
