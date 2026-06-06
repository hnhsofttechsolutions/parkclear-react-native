import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppText from '../../components/ui/app-text';
import PageLoader from '../../components/ui/page-loader';
import { PATHS } from '../../navigation/paths';
import { useGetNearbyZonesMutation } from '../../store/api/uploadApi';
import { Colors } from '../../utils/colors';
import { useCurrentLocation } from '../../utils/useCurrentLocation';
import { CURB_ZONE_STATUS_THEME, NEARBY_RADIUS_METERS } from './constants';
import { getZoneStatusLabel, normalizeZonesResponse } from './curb-zone.utils';
import type { CurbZoneItem, SelectCurbZoneRouteParams } from './types';

type Props = {
  route?: { params?: SelectCurbZoneRouteParams };
};

const SelectCurbZoneScreen = ({ route }: Props) => {
  const navigation = useNavigation<any>();
  const {
    location,
    error: locationError,
    loading: locationLoading,
    fetchLocation,
  } = useCurrentLocation();
  const [getNearbyZones, { isLoading: isZonesLoading }] =
    useGetNearbyZonesMutation();

  const [zones, setZones] = useState<CurbZoneItem[]>(
    route?.params?.zones ?? [],
  );
  const [refreshing, setRefreshing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const isLoading =
    !hasFetched || isZonesLoading || (locationLoading && location == null);

  const fetchNearbyZones = useCallback(async () => {
    const lat = route?.params?.lat ?? location?.latitude;
    const lng = route?.params?.lng ?? location?.longitude;
    if (lat == null || lng == null) return;

    try {
      const response = await getNearbyZones({
        lat: '34.039333',
        lng: '-118.252633',
        radius: route?.params?.radius?.toString() ?? NEARBY_RADIUS_METERS,
        timezone: 'PST',
        // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }).unwrap();

      console.log('response select curb zone screen---->', response);

      setZones(normalizeZonesResponse(response));
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
  }, [
    getNearbyZones,
    location?.latitude,
    location?.longitude,
    route?.params?.lat,
    route?.params?.lng,
    route?.params?.radius,
  ]);

  useEffect(() => {
    if (route?.params?.zones?.length) {
      setHasFetched(true);
      return;
    }
    fetchLocation();
  }, [fetchLocation, route?.params?.zones]);

  useEffect(() => {
    if (route?.params?.zones?.length || locationLoading) return;

    const lat = route?.params?.lat ?? location?.latitude;
    const lng = route?.params?.lng ?? location?.longitude;

    if (lat != null && lng != null) {
      fetchNearbyZones();
      return;
    }

    if (locationError) setHasFetched(true);
  }, [
    fetchNearbyZones,
    location?.latitude,
    location?.longitude,
    locationError,
    locationLoading,
    route?.params?.lat,
    route?.params?.lng,
    route?.params?.zones,
  ]);

  useEffect(() => {
    if (!locationError) return;
    Toast.show({ type: 'error', text1: 'Location', text2: locationError });
  }, [locationError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasFetched(false);
    await fetchLocation();
    await fetchNearbyZones();
    setRefreshing(false);
  }, [fetchLocation, fetchNearbyZones]);

  const emptyMessage = useMemo(
    () =>
      locationError
        ? 'Turn on location to find nearby curb zones.'
        : 'No curb zones found nearby.',
    [locationError],
  );

  const handleZonePress = (zone: CurbZoneItem) => {
    if (zone.status === 'full') return;
    navigation.navigate(PATHS.CurbSegment, { zone });
  };

  const renderZoneCard = ({ item }: { item: CurbZoneItem }) => {
    const theme = CURB_ZONE_STATUS_THEME[item.status];
    const isDisabled = item.status === 'full';

    return (
      <TouchableOpacity
        style={[styles.card, isDisabled && styles.cardDisabled]}
        onPress={() => handleZonePress(item)}
        activeOpacity={isDisabled ? 1 : 0.85}
        disabled={isDisabled}
      >
        <View style={[styles.accentBar, { backgroundColor: theme.accent }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardTopRow}>
            <AppText
              font="bold"
              size={15}
              color={Colors.primary}
              style={styles.streetName}
            >
              {item.street_name}
            </AppText>
            <ChevronRight size={20} color={Colors.greyIcon} strokeWidth={2} />
          </View>
          <AppText size={14} color={Colors.grey}>
            {item.parking_type_label}
          </AppText>
          <View style={styles.cardBottomRow}>
            <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
              <AppText font="medium" size={13} color={theme.badgeText}>
                {getZoneStatusLabel(item)}
              </AppText>
            </View>
            <View style={styles.dotWrap}>
              <View style={[styles.dotGlow, { backgroundColor: theme.glow }]} />
              <View style={[styles.dot, { backgroundColor: theme.dot }]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.safeTop} />
      <StatusBar backgroundColor={Colors.blue} barStyle="light-content" />
      <PageLoader visible={isLoading && !refreshing} />

      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={28} color={Colors.darkBlue} />
          </TouchableOpacity>
          <AppText
            font="bold"
            size={22}
            color={Colors.white}
            style={styles.headerTitle}
          >
            Select Curb Zone
          </AppText>
        </View>

        <FlatList
          data={zones}
          keyExtractor={item => item.curb_zone_id}
          renderItem={renderZoneCard}
          style={styles.list}
          contentContainerStyle={[
            styles.listContent,
            zones.length === 0 && styles.listEmptyContent,
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.darkBlue}
              colors={[Colors.darkBlue]}
            />
          }
          ListEmptyComponent={
            hasFetched && !isLoading ? (
              <View style={styles.emptyWrap}>
                <AppText
                  font="medium"
                  size={16}
                  color={Colors.primary}
                  align="center"
                >
                  {emptyMessage}
                </AppText>
                {locationError ? (
                  <TouchableOpacity style={styles.retryBtn} onPress={onRefresh}>
                    <AppText font="medium" size={14} color={Colors.white}>
                      Try Again
                    </AppText>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null
          }
        />
      </View>
    </>
  );
};

export default SelectCurbZoneScreen;

const styles = StyleSheet.create({
  safeTop: { flex: 0, backgroundColor: Colors.blue },
  root: { flex: 1, backgroundColor: Colors.blue },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 18,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { marginLeft: 12, flex: 1 },
  list: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },
  listEmptyContent: { flexGrow: 1, justifyContent: 'center' },
  separator: { height: 16 },
  emptyWrap: { alignItems: 'center', gap: 16, paddingHorizontal: 24 },
  retryBtn: {
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    elevation: 10,
  },
  cardDisabled: { opacity: 0.92 },
  accentBar: { width: 5 },
  cardBody: { flex: 1, padding: 16, gap: 6 },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  streetName: { flex: 1, letterSpacing: 0.2 },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dotWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotGlow: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
