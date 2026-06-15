import { useNavigation } from '@react-navigation/native';
import {
  ChevronLeft,
  Layers,
  LocateFixed,
  Minus,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Polyline,
  PROVIDER_GOOGLE,
  type MapType,
  type Region,
} from 'react-native-maps';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BottomSheetModal from '../../components/bottom-sheet-modal';
import AppText from '../../components/ui/app-text';
import PageLoader from '../../components/ui/page-loader';
import { useLocationPermission } from '../../hooks/use-location-permission';
import { useGetNearbyZonesMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import { useCurrentLocation } from '../../utils/useCurrentLocation';
import {
  INITIAL_MAP_REGION,
  MAP_LEGEND,
  NEARBY_RADIUS_METERS,
  SCHEDULE_THEME,
  TEST_MAP_LAT,
  TEST_MAP_LNG,
} from './constants';
import {
  getPrimaryRuleCardTheme,
  getPrimaryZoneRuleBadge,
  getPrimaryZoneRuleMessage,
  getZoneScheduleItems,
  normalizeZonesResponse,
  zonesToMapPolylines,
} from './curb-zone.utils';
import type { CurbZoneItem } from './types';

const IOS_MAP_TYPES: MapType[] = ['hybridFlyover', 'standard', 'satellite'];
const ANDROID_MAP_TYPES: MapType[] = ['standard', 'satellite', 'hybrid'];
const USER_LOCATION_DELTA = 0.004;

const regionFromCoords = (latitude: number, longitude: number): Region => ({
  latitude,
  longitude,
  latitudeDelta: USER_LOCATION_DELTA,
  longitudeDelta: USER_LOCATION_DELTA,
});

const ParkMapScreen = () => {
  const navigation = useNavigation<any>();
  const mapRef = useRef<MapView>(null);
  const shouldFollowUserRef = useRef(false);
  const hasInitializedLocationRef = useRef(false);
  const insets = useSafeAreaInsets();

  const [zones, setZones] = useState<CurbZoneItem[]>([]);
  const [selectedZone, setSelectedZone] = useState<CurbZoneItem | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [initialRegion, setInitialRegion] =
    useState<Region>(INITIAL_MAP_REGION);
  const [region, setRegion] = useState<Region>(INITIAL_MAP_REGION);
  const [mapType, setMapType] = useState<MapType>(
    Platform.OS === 'ios' ? 'hybridFlyover' : 'standard',
  );
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  const {
    location,
    error: locationError,
    fetchLocation,
  } = useCurrentLocation();
  const { hasPermission, requestPermission } = useLocationPermission({
    checkOnlyOnMount: true,
  });
  const [getNearbyZones, { isLoading: isZonesLoading }] =
    useGetNearbyZonesMutation();

  const isLoading = !hasFetched || isZonesLoading;

  const polylines = useMemo(() => zonesToMapPolylines(zones), [zones]);

  const selectedSchedule = useMemo(
    () => (selectedZone ? getZoneScheduleItems(selectedZone) : []),
    [selectedZone],
  );

  const stopFollowingUser = useCallback(() => {
    shouldFollowUserRef.current = false;
    setIsFollowingUser(false);
  }, []);

  const handleZoom = useCallback(
    (factor: number) => {
      stopFollowingUser();
      setRegion(current => {
        const next = {
          ...current,
          latitudeDelta: current.latitudeDelta * factor,
          longitudeDelta: current.longitudeDelta * factor,
        };
        mapRef.current?.animateToRegion(next, 250);
        return next;
      });
    },
    [stopFollowingUser],
  );

  const centerMapOnCoords = useCallback(
    (latitude: number, longitude: number) => {
      const next = regionFromCoords(latitude, longitude);
      setRegion(next);
      mapRef.current?.animateToRegion(next, 400);
    },
    [],
  );

  const handleMyLocation = useCallback(async () => {
    if (hasPermission !== true && !(await requestPermission())) return;
    shouldFollowUserRef.current = true;
    setIsFollowingUser(true);
    await fetchLocation();
  }, [fetchLocation, hasPermission, requestPermission]);

  const handleToggleMapType = useCallback(() => {
    const types = Platform.OS === 'ios' ? IOS_MAP_TYPES : ANDROID_MAP_TYPES;
    setMapType(current => {
      const index = types.indexOf(current);
      return types[(index + 1) % types.length];
    });
  }, []);

  const fetchNearbyZones = useCallback(
    async (coords?: { lat: number; lng: number }) => {
      const lat = __DEV__
        ? TEST_MAP_LAT
        : coords?.lat ?? location?.latitude ?? region.latitude;
      const lng = __DEV__
        ? TEST_MAP_LNG
        : coords?.lng ?? location?.longitude ?? region.longitude;

      try {
        const response = await getNearbyZones({
          lat: String(lat),
          lng: String(lng),
          radius: NEARBY_RADIUS_METERS,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }).unwrap();

        console.log('response park map screen---->', response);

        if (response.status === 'success' && response?.total_zones > 0) {
          const nextZones = normalizeZonesResponse(response);
          setZones(nextZones);
        } else {
          setZones([]);
          Toast.show({
            type: 'info',
            text1: 'No curb zones found nearby.',
          });
        }
      } catch (err: any) {
        setZones([]);
        Toast.show({
          type: 'error',
          text1: 'Failed to load zones',
          text2: err?.data?.message ?? 'Something went wrong',
        });
      } finally {
        setHasFetched(true);
      }
    },
    [
      getNearbyZones,
      location?.latitude,
      location?.longitude,
      region.latitude,
      region.longitude,
    ],
  );

  const handleRefreshZones = useCallback(() => {
    stopFollowingUser();
    setSelectedZone(null);
    fetchNearbyZones({ lat: region.latitude, lng: region.longitude });
  }, [fetchNearbyZones, region.latitude, region.longitude, stopFollowingUser]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  useEffect(() => {
    if (!locationError) return;
    Toast.show({ type: 'error', text1: 'Location', text2: locationError });
  }, [locationError]);

  useEffect(() => {
    if (hasInitializedLocationRef.current) return;
    if (location?.latitude == null || location?.longitude == null) return;

    hasInitializedLocationRef.current = true;

    const next = regionFromCoords(location.latitude, location.longitude);
    setInitialRegion(next);
    setRegion(next);

    if (mapReady) {
      centerMapOnCoords(location.latitude, location.longitude);
    }

    fetchNearbyZones({ lat: location.latitude, lng: location.longitude });
  }, [
    centerMapOnCoords,
    fetchNearbyZones,
    location?.latitude,
    location?.longitude,
    mapReady,
  ]);

  useEffect(() => {
    if (!mapReady || !hasInitializedLocationRef.current) return;
    if (location?.latitude == null || location?.longitude == null) return;

    centerMapOnCoords(location.latitude, location.longitude);
  }, [centerMapOnCoords, location?.latitude, location?.longitude, mapReady]);

  useEffect(() => {
    if (!locationError || hasInitializedLocationRef.current) return;

    hasInitializedLocationRef.current = true;
    fetchNearbyZones();
  }, [fetchNearbyZones, locationError]);

  useEffect(() => {
    if (!shouldFollowUserRef.current) return;
    if (location?.latitude == null || location?.longitude == null) return;

    centerMapOnCoords(location.latitude, location.longitude);
  }, [centerMapOnCoords, location?.latitude, location?.longitude]);

  const handlePolylinePress = useCallback((zone: CurbZoneItem) => {
    setSelectedZone(zone);
  }, []);

  const closeZonePopup = useCallback(() => {
    setSelectedZone(null);
  }, []);

  const selectedRuleBadge = selectedZone
    ? getPrimaryZoneRuleBadge(selectedZone)
    : null;

  const selectedRuleTheme = selectedZone
    ? getPrimaryRuleCardTheme(selectedZone)
    : null;

  const selectedRuleMessage = selectedZone
    ? getPrimaryZoneRuleMessage(selectedZone)
    : null;

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor={Colors.blue}
        barStyle="light-content"
      />
      <PageLoader visible={isLoading} />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        mapType={mapType}
        initialRegion={initialRegion}
        onMapReady={() => setMapReady(true)}
        onRegionChangeComplete={setRegion}
        showsUserLocation={hasPermission === true}
        showsCompass={false}
        toolbarEnabled={false}
        rotateEnabled={false}
      >
        {polylines?.map(line => {
          const isSelected =
            selectedZone?.curb_zone_id === line.zone.curb_zone_id;

          return (
            <Polyline
              key={line.id}
              coordinates={line.coordinates}
              strokeColor={line.color}
              strokeWidth={isSelected ? 14 : 8}
              lineCap="round"
              lineJoin="round"
              geodesic
              tappable
              zIndex={isSelected ? 3 : 2}
              onPress={() => handlePolylinePress(line.zone)}
            />
          );
        })}
      </MapView>

      <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={28} color={Colors.darkBlue} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <AppText size={12} color="rgba(255,255,255,0.85)">
              Curb Zone Map
            </AppText>
            <AppText
              font="bold"
              size={18}
              color={Colors.white}
              numberOfLines={1}
            >
              Nearby Curb Zones
            </AppText>
          </View>
        </View>
      </SafeAreaView>

      <View style={[styles.mapControls, { top: insets.top + 64 }]}>
        <View style={styles.zoomGroup}>
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => handleZoom(0.7)}
          >
            <Plus size={18} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.zoomDivider} />
          <TouchableOpacity
            style={styles.zoomBtn}
            onPress={() => handleZoom(1.3)}
          >
            <Minus size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.mapControlBtn,
            isFollowingUser ? styles.mapControlBtnActive : null,
          ]}
          onPress={handleMyLocation}
        >
          <LocateFixed
            size={18}
            color={isFollowingUser ? Colors.white : Colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapControlBtn}
          onPress={handleRefreshZones}
        >
          <RefreshCw size={18} color={Colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapControlBtn}
          onPress={handleToggleMapType}
        >
          <Layers size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.legendSafeArea}>
        <View style={styles.legendBar}>
          {MAP_LEGEND.map(item => (
            <View key={item.key} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <AppText size={12} color={Colors.primary}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </SafeAreaView>

      <BottomSheetModal
        visible={selectedZone != null}
        onClose={closeZonePopup}
        height={520}
      >
        {selectedZone ? (
          <View style={styles.popupContent}>
            <View style={styles.popupHeader}>
              <View style={styles.popupTitleWrap}>
                <AppText font="bold" size={18} color={Colors.primary}>
                  {selectedZone.street_name}
                </AppText>
                <AppText size={14} color={Colors.grey}>
                  {selectedZone.parking_type_label}
                </AppText>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={closeZonePopup}
              >
                <X size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: selectedRuleBadge?.badgeBg },
                ]}
              >
                <AppText
                  font="medium"
                  size={13}
                  color={selectedRuleBadge?.badgeText}
                >
                  {selectedRuleBadge?.label}
                </AppText>
              </View>
              {selectedZone.target_line_color ? (
                <View style={styles.colorChip}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: selectedZone.target_line_color },
                    ]}
                  />
                  <AppText size={12} color={Colors.grey}>
                    Zone Color
                  </AppText>
                </View>
              ) : null}
            </View>

            {selectedRuleMessage ? (
              <View
                style={[
                  styles.ruleCard,
                  {
                    backgroundColor: selectedRuleTheme?.backgroundColor,
                    borderColor: selectedRuleTheme?.borderColor,
                  },
                ]}
              >
                {selectedRuleTheme?.status === 'allowed' ? (
                  <ShieldCheck
                    size={20}
                    color={selectedRuleTheme.accentColor}
                  />
                ) : (
                  <ShieldAlert
                    size={20}
                    color={selectedRuleTheme?.accentColor}
                  />
                )}
                <View style={styles.ruleTextWrap}>
                  <AppText
                    font="medium"
                    size={11}
                    color={selectedRuleTheme?.accentColor}
                    style={styles.ruleLabel}
                  >
                    PARKING STATUS
                  </AppText>
                  <AppText font="bold" size={15} color={Colors.primary}>
                    {selectedRuleMessage}
                  </AppText>
                </View>
              </View>
            ) : null}

            <AppText
              font="medium"
              size={11}
              color={Colors.grey}
              style={styles.scheduleHeading}
            >
              WEEKLY SCHEDULE
            </AppText>

            {selectedSchedule.length > 0 ? (
              selectedSchedule.map((item, index) => {
                const theme = SCHEDULE_THEME[item.status];
                return (
                  <View key={item.id}>
                    {index > 0 ? <View style={styles.scheduleGap} /> : null}
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
                        style={[
                          styles.scheduleBadge,
                          { backgroundColor: theme.badgeBg },
                        ]}
                      >
                        <AppText
                          font="medium"
                          size={12}
                          color={theme.badgeText}
                        >
                          {theme.label}
                        </AppText>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <AppText size={14} color={Colors.grey} align="center">
                No schedule found for this zone.
              </AppText>
            )}
          </View>
        ) : null}
      </BottomSheetModal>
    </View>
  );
};

export default ParkMapScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.blue },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.blue,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.blue,
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
  mapControls: {
    position: 'absolute',
    right: 12,
    gap: 8,
    zIndex: 10,
  },
  zoomGroup: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
  },
  zoomBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    width: 24,
    height: 1,
    backgroundColor: Colors.divider,
  },
  mapControlBtn: {
    width: 36,
    height: 36,
    borderRadius: 360,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControlBtnActive: {
    backgroundColor: Colors.primary,
  },
  legendSafeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  popupContent: { paddingHorizontal: 20, paddingBottom: 24 },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  popupTitleWrap: { flex: 1, gap: 4 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  colorChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  ruleTextWrap: { flex: 1, gap: 6 },
  ruleLabel: { letterSpacing: 0.6 },
  scheduleHeading: { letterSpacing: 0.6, marginBottom: 12 },
  scheduleGap: { height: 10 },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
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
