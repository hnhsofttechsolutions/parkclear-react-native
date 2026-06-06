import { Trash2 } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import DeleteModal from '../components/modals/delete-modal';
import SafeAreaWrapper from '../components/safe-area-wrapper';
import { AppBar } from '../components/ui/app-bar';
import AppText from '../components/ui/app-text';
import PageLoader from '../components/ui/page-loader';
import { FlutterStrings } from '../constants/flutterStrings';
import { settingApi, useGetActiveAlertsQuery } from '../store/api/settingApi';
import {
  useCancelRemindMutation,
  useDeleteParkingReminderMutation,
} from '../store/api/uploadApi';
import { Colors } from '../utils/colors';
import { syncIosBadgeWithActiveAlerts } from '../utils/notification-service';

type AlertTab = 'current' | 'passed' | 'cancel';

type AlertItem = {
  parking_end_time: string;
  alert_time: string;
  is_active: boolean;
  is_pass: boolean;
  id?: number | string;
};

type SectionOptions = {
  showCancel?: boolean;
  showDelete?: boolean;
  variant: AlertTab;
};

const TABS: { key: AlertTab; label: string }[] = [
  { key: 'current', label: FlutterStrings.currentAlerts },
  { key: 'passed', label: FlutterStrings.passedAlerts },
  { key: 'cancel', label: FlutterStrings.cancelledAlerts },
];

const ActiveAlertScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetActiveAlertsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const [activeTab, setActiveTab] = useState<AlertTab>('current');
  const [refreshing, setRefreshing] = useState(false);
  const [cancelRemind, { isLoading: isCancelling }] = useCancelRemindMutation();
  const [deleteParkingReminder, { isLoading: isDeleting }] =
    useDeleteParkingReminderMutation();

  const [cancellingId, setCancellingId] = useState<number | string | null>(
    null,
  );
  const [alertToDelete, setAlertToDelete] = useState<AlertItem | null>(null);

  const alerts: AlertItem[] = Array.isArray(data)
    ? data
    : data?.results ?? data?.data ?? [];

  const currentAlerts = useMemo(
    () =>
      alerts.filter(item => item.is_active === true && item.is_pass === false),
    [alerts],
  );

  const passedAlerts = useMemo(
    () => alerts.filter(item => item.is_pass === true),
    [alerts],
  );

  const cancelledAlerts = useMemo(
    () =>
      alerts.filter(item => item.is_active === false && item.is_pass === false),
    [alerts],
  );

  const tabData: Record<AlertTab, AlertItem[]> = {
    current: currentAlerts,
    passed: passedAlerts,
    cancel: cancelledAlerts,
  };

  const tabCounts: Record<AlertTab, number> = {
    current: currentAlerts.length,
    passed: passedAlerts.length,
    cancel: cancelledAlerts.length,
  };

  const emptyMessages: Record<AlertTab, string> = {
    current: FlutterStrings.noActiveAlerts,
    passed: FlutterStrings.noPassedAlerts,
    cancel: FlutterStrings.noCancelledAlerts,
  };

  const tabOptions: Record<AlertTab, SectionOptions> = {
    current: { variant: 'current', showCancel: true },
    passed: { variant: 'passed', showDelete: true },
    cancel: { variant: 'cancel' },
  };

  const refreshAlerts = useCallback(async () => {
    dispatch(settingApi.util.invalidateTags(['ACTIVE_ALERTS']));
    await refetch();
    await syncIosBadgeWithActiveAlerts();
  }, [dispatch, refetch]);

  const onPullRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshAlerts();
    } finally {
      setRefreshing(false);
    }
  }, [refreshAlerts]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    syncIosBadgeWithActiveAlerts();
  }, [data]);

  const handleCancelAlert = async (item: AlertItem) => {
    setCancellingId(item?.id ?? null);

    try {
      const response = await cancelRemind({
        alert_id: item?.id ?? '',
      }).unwrap();

      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Alert Cancelled',
          text2: response?.message,
        });
        await refreshAlerts();
        setActiveTab('cancel');
      }
    } catch (error: any) {
      Toast.show({
        type: 'info',
        text1: 'Cancel Alert Failed',
        text2: error?.data?.message ?? 'Something went wrong',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleDeleteAlert = async () => {
    if (!alertToDelete) {
      return;
    }

    try {
      const response = await deleteParkingReminder({
        alert_id: alertToDelete?.id ?? '',
      }).unwrap();

      if (response?.status) {
        Toast.show({
          type: 'success',
          text1: 'Alert Deleted',
          text2: response?.message,
        });
        setAlertToDelete(null);
        await refreshAlerts();
      }
    } catch (error: any) {
      Toast.show({
        type: 'info',
        text1: 'Delete Alert Failed',
        text2: error?.data?.message ?? 'Something went wrong',
      });
    }
  };

  const renderTabs = () => (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
        const selected = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, selected && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.85}
          >
            <AppText
              font="medium"
              size={14}
              color={selected ? '#2D8A2E' : Colors.white}
            >
              {tab.label}
            </AppText>
            <View style={[styles.tabCount, selected && styles.tabCountActive]}>
              <AppText
                font="medium"
                size={11}
                color={selected ? Colors.white : 'rgba(255,255,255,0.95)'}
              >
                {tabCounts[tab.key]}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderStatusChip = (variant: AlertTab, isActive: boolean) => {
    const label =
      variant === 'passed'
        ? FlutterStrings.passedStatus
        : variant === 'cancel'
        ? FlutterStrings.cancelledStatus
        : isActive
        ? FlutterStrings.activeStatus
        : null;

    if (!label) {
      return null;
    }

    return (
      <View
        style={[
          styles.statusChip,
          variant === 'passed' && styles.statusChipPassed,
          variant === 'cancel' && styles.statusChipCancel,
          variant === 'current' && styles.statusChipActive,
        ]}
      >
        <AppText font="medium" size={12} color={Colors.white}>
          {label}
        </AppText>
      </View>
    );
  };

  const renderAlertCard = (
    item: AlertItem,
    index: number,
    options: SectionOptions,
  ) => {
    const parkingUntil = moment(item.parking_end_time).format('hh:mm A');
    const reminderAt = moment(item.alert_time).format('hh:mm A');
    const itemKey = item.id ?? index;
    const isThisCancelling = cancellingId === itemKey && isCancelling;

    return (
      <View
        style={[
          styles.alertCard,
          options.variant === 'passed' && styles.alertCardPassed,
          options.variant === 'cancel' && styles.alertCardCancel,
          options.variant === 'current' && styles.alertCardCurrent,
        ]}
      >
        <View style={styles.cardTopRow}>
          {renderStatusChip(options.variant, item.is_active)}
          {options.showDelete ? (
            <TouchableOpacity
              style={styles.trashBtn}
              onPress={() => setAlertToDelete(item)}
              disabled={isDeleting}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={22} color={Colors.settingsRed} strokeWidth={2.25} />
            </TouchableOpacity>
          ) : (
            <View style={styles.trashBtnPlaceholder} />
          )}
        </View>

        <View style={styles.timeBlock}>
          <AppText size={14} color="rgba(255,255,255,0.85)">
            {FlutterStrings.parkingUntil}
          </AppText>
          <View style={styles.timePill}>
            <AppText font="medium" size={36} color={Colors.white}>
              {parkingUntil}
            </AppText>
          </View>
        </View>

        <View style={styles.reminderRow}>
          <View style={styles.reminderIcon}>
            <AppText size={18}>🔔</AppText>
          </View>
          <View style={styles.reminderTextWrap}>
            <AppText size={13} color="rgba(255,255,255,0.75)">
              {FlutterStrings.reminderAt}
            </AppText>
            <AppText font="medium" size={17} color={Colors.white}>
              {reminderAt}
            </AppText>
          </View>
        </View>

        {options.showCancel && item.is_active && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancelAlert(item)}
            disabled={isThisCancelling}
            activeOpacity={0.85}
          >
            {isThisCancelling ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <AppText font="medium" size={16} color={Colors.white}>
                Cancel Alert
              </AppText>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyBox = (message: string) => (
    <View style={styles.emptyBox}>
      <View style={styles.emptyIconCircle}>
        <AppText size={28}>🔔</AppText>
      </View>
      <AppText
        font="medium"
        size={16}
        color={Colors.white}
        align="center"
        style={styles.emptyTitle}
      >
        {message}
      </AppText>
      <AppText size={14} color="rgba(255,255,255,0.75)" align="center">
        Set a reminder from your parking result to see it here.
      </AppText>
    </View>
  );

  const renderTabContent = () => {
    const items = tabData[activeTab];
    const options = tabOptions[activeTab];

    return (
      <View style={styles.section}>
        {items.length === 0 ? (
          renderEmptyBox(emptyMessages[activeTab])
        ) : (
          <View style={styles.cardsStack}>
            {items.map((item, index) => (
              <View key={String(item.id ?? `${activeTab}-${index}`)}>
                {index > 0 ? <View style={styles.cardGap} /> : null}
                {renderAlertCard(item, index, options)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safe}>
      <LinearGradient
        colors={['#9AEF8B', '#41B540']}
        style={StyleSheet.absoluteFill}
      >
        <SafeAreaWrapper backgroundColor="transparent" style={styles.safe}>
          <StatusBar backgroundColor={'#9AEF8B'} barStyle="light-content" />
          <PageLoader visible={isLoading && !refreshing} />
          <View style={styles.safe}>
            <View style={styles.padH}>
              <AppBar
                title={FlutterStrings.activeAlerts}
                textColor={Colors.white}
                onBack={() => navigation.goBack()}
              />
              {renderTabs()}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onPullRefresh}
                    tintColor={Colors.white}
                    colors={['#41B540', '#9AEF8B']}
                    progressBackgroundColor={Colors.white}
                  />
                }
              >
                {renderTabContent()}
              </ScrollView>
            </View>
          </View>
        </SafeAreaWrapper>
      </LinearGradient>

      <DeleteModal
        visible={alertToDelete != null}
        title={FlutterStrings.deleteAlertTitle}
        description={FlutterStrings.deleteAlertDescription}
        isLoading={isDeleting}
        onClose={() => setAlertToDelete(null)}
        onDelete={handleDeleteAlert}
      />
    </View>
  );
};

export default ActiveAlertScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  padH: { paddingHorizontal: 20, flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
    gap: 4,
    marginTop: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  tabCount: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  tabCountActive: {
    backgroundColor: '#41B540',
  },
  listContent: { paddingBottom: 28 },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  cardsStack: {},
  cardGap: { height: 14 },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderStyle: 'dashed',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: { marginBottom: 6 },
  alertCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  alertCardCurrent: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  alertCardPassed: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  alertCardCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  trashBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  trashBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusChipActive: {
    backgroundColor: 'rgba(65, 181, 64, 0.9)',
  },
  statusChipPassed: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statusChipCancel: {
    backgroundColor: 'rgba(236, 70, 70, 0.85)',
  },
  timeBlock: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  timePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTextWrap: { flex: 1, gap: 2 },
  cancelBtn: {
    marginTop: 16,
    minHeight: 50,
    borderRadius: 40,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
});
