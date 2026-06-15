import type { Region } from 'react-native-maps';
import { CURB_ZONE_STATUS_THEME, SCHEDULE_THEME } from './constants';
import type {
  CurbZoneGeometry,
  CurbZoneItem,
  CurbZoneStatus,
  MapCoordinate,
  NearbyZoneApiItem,
  ParkMapPolyline,
  ScheduleItem,
  ScheduleStatus,
  ZoneRule,
  ZoneScheduleApiItem,
  ZoneScheduleResult,
} from './types';

export function formatParkingAngle(angle?: string): string {
  const normalized = angle?.toLowerCase().trim();

  if (normalized === 'parallel') return 'Parallel Parking';
  if (normalized === 'diagonal') return 'Diagonal Parking';
  if (normalized === 'perpendicular') return 'Perpendicular Parking';
  if (!angle) return 'Parking';

  return `${angle.charAt(0).toUpperCase()}${angle.slice(1)} Parking`;
}

export function mapZoneStatus(available_spaces: number): CurbZoneStatus {
  if (available_spaces <= 0) return 'full';
  if (available_spaces === 1) return 'unknown';
  return 'available';
}

function normalizeApiZoneStatus(
  apiStatus: string | undefined,
  available_spaces: number,
): CurbZoneStatus {
  const normalized = apiStatus?.toLowerCase().trim();

  if (normalized === 'full') return 'full';
  if (normalized === 'unknown' || normalized === 'limited') return 'unknown';
  if (normalized === 'available') return 'available';

  return mapZoneStatus(available_spaces);
}

export function isNearbyZoneApiItem(value: unknown): value is NearbyZoneApiItem {
  if (typeof value !== 'object' || value == null) return false;

  const zone = value as Record<string, unknown>;
  const hasId =
    typeof zone.curb_zone_id === 'string' ||
    typeof zone.curb_zone_id === 'number';

  return hasId && typeof zone.street_name === 'string';
}

function getPrimaryZoneRule(rules?: ZoneRule[]): ZoneRule | null {
  if (!Array.isArray(rules) || rules.length === 0) return null;
  return rules[0];
}

export function mapApiZoneToItem(zone: NearbyZoneApiItem): CurbZoneItem {
  const available_spaces = Number(zone.available_spaces ?? 0);
  const spaces = Number.isNaN(available_spaces) ? 0 : available_spaces;
  const primaryRule = getPrimaryZoneRule(zone.rules);

  return {
    curb_zone_id: String(zone.curb_zone_id),
    street_name: zone.street_name,
    parking_angle: zone.parking_angle,
    parking_type_label: formatParkingAngle(zone.parking_angle),
    available_spaces: spaces,
    status: normalizeApiZoneStatus(zone.status, spaces),
    curb_policy_ids: Array.isArray(zone.curb_policy_ids)
      ? zone.curb_policy_ids
      : [],
    geometry: normalizeZoneGeometry(zone.geometry),
    rules: Array.isArray(zone.rules) ? zone.rules : [],
    target_line_color: primaryRule?.target_line_color ?? null,
    primary_governing_rule: primaryRule?.primary_governing_rule ?? null,
  };
}

export function getZonePolylineColor(zone: CurbZoneItem): string {
  return zone.target_line_color ?? getSegmentColor(zone.status);
}

export type PrimaryRuleParkingStatus = ScheduleStatus | 'unknown';

export type PrimaryRuleCardTheme = {
  status: PrimaryRuleParkingStatus;
  backgroundColor: string;
  borderColor: string;
  accentColor: string;
};

export function getPrimaryZoneRuleMessage(zone: CurbZoneItem): string | null {
  const message = getPrimaryZoneRule(zone.rules)?.message?.trim();
  return message || null;
}

export type PrimaryZoneRuleBadge = {
  label: string;
  badgeBg: string;
  badgeText: string;
};

export function getPrimaryZoneRuleBadge(zone: CurbZoneItem): PrimaryZoneRuleBadge {
  const isAllowed = getPrimaryZoneRule(zone.rules)?.is_allowed;

  if (isAllowed === true) {
    return {
      label: SCHEDULE_THEME.allowed.label,
      badgeBg: SCHEDULE_THEME.allowed.badgeBg,
      badgeText: SCHEDULE_THEME.allowed.badgeText,
    };
  }

  if (isAllowed === false) {
    return {
      label: 'No parking',
      badgeBg: SCHEDULE_THEME.blocked.badgeBg,
      badgeText: SCHEDULE_THEME.blocked.badgeText,
    };
  }

  return {
    label: SCHEDULE_THEME.unknown.label,
    badgeBg: SCHEDULE_THEME.unknown.badgeBg,
    badgeText: SCHEDULE_THEME.unknown.badgeText,
  };
}

function resolvePrimaryRuleParkingStatus(
  zone: CurbZoneItem,
): PrimaryRuleParkingStatus {
  const primaryRule = getPrimaryZoneRule(zone.rules);

  if (primaryRule?.is_allowed === true) return 'allowed';
  if (primaryRule?.is_allowed === false) return 'blocked';

  const schedule = primaryRule?.weekly_schedule ?? [];

  if (schedule.length > 0) {
    const allowedCount = schedule.filter(item => item.is_allowed === true).length;
    const blockedCount = schedule.filter(
      item => item.is_allowed === false,
    ).length;

    if (blockedCount > 0 && allowedCount === 0) return 'blocked';
    if (allowedCount > 0 && blockedCount === 0) return 'allowed';
    if (allowedCount > 0 && blockedCount > 0) return 'unknown';
  }

  const lineColor = (
    zone.target_line_color ??
    primaryRule?.target_line_color ??
    ''
  ).toUpperCase();

  if (['#EC4646', '#FF0000', '#D93030'].includes(lineColor)) {
    return 'blocked';
  }
  if (['#EFB71C', '#C98A00', '#302F26'].includes(lineColor)) {
    return 'unknown';
  }
  if (['#49B945', '#2E8B2E', '#00FF00'].includes(lineColor)) {
    return 'allowed';
  }

  const ruleStatus = primaryRule?.status?.toLowerCase() ?? '';
  if (
    ruleStatus.includes('block') ||
    ruleStatus.includes('no_parking') ||
    ruleStatus.includes('denied')
  ) {
    return 'blocked';
  }
  if (ruleStatus.includes('limit')) return 'unknown';

  if (zone.status === 'full') return 'blocked';
  if (zone.status === 'unknown') return 'unknown';
  return 'allowed';
}

export function getPrimaryRuleCardTheme(
  zone: CurbZoneItem,
): PrimaryRuleCardTheme {
  const status = resolvePrimaryRuleParkingStatus(zone);

  if (status === 'allowed') {
    return {
      status,
      backgroundColor: '#E8F8E8',
      borderColor: '#C8E6C8',
      accentColor: '#2E8B2E',
    };
  }

  if (status === 'unknown') {
    return {
      status,
      backgroundColor: CURB_ZONE_STATUS_THEME.unknown.badgeBg,
      borderColor: '#e0e0e0',
      accentColor: CURB_ZONE_STATUS_THEME.unknown.accent,
    };
  }

  return {
    status,
    backgroundColor: '#FFF5F5',
    borderColor: '#F9D7D7',
    accentColor: '#D93030',
  };
}

export function zonesToMapPolylines(zones: CurbZoneItem[]): ParkMapPolyline[] {
  return zones.flatMap(zone => {
    const lines = geometryToPolylines(zone.geometry);
    const color = getZonePolylineColor(zone);

    return lines.map((coordinates, index) => ({
      id: `${zone.curb_zone_id}-${index}`,
      zone,
      coordinates,
      color,
    }));
  });
}

export function getRegionFromZones(zones: CurbZoneItem[]): Region | null {
  const coordinates = zones.flatMap(zone =>
    geometryToMapCoordinates(zone.geometry),
  );
  return getRegionFromCoordinates(coordinates);
}

export function getZoneScheduleItems(zone: CurbZoneItem): ScheduleItem[] {
  const primaryRule = getPrimaryZoneRule(zone.rules);
  if (!primaryRule) return [];

  const parentIsAllowed = primaryRule.is_allowed;

  return extractScheduleCandidates(primaryRule)
    .filter(isZoneScheduleApiItem)
    .map((item, index) => mapScheduleApiItem(item, index, parentIsAllowed));
}

function lineToCoordinates(line: number[][]): MapCoordinate[] {
  return line
    .filter(point => Array.isArray(point) && point.length >= 2)
    .map(([lng, lat]) => ({
      latitude: Number(lat),
      longitude: Number(lng),
    }))
    .filter(
      point =>
        !Number.isNaN(point.latitude) &&
        !Number.isNaN(point.longitude),
    );
}

export function normalizeZoneGeometry(
  geometry: CurbZoneGeometry | string | null | undefined,
): CurbZoneGeometry | null {
  if (!geometry) return null;

  let parsed: unknown = geometry;
  if (typeof geometry === 'string') {
    try {
      parsed = JSON.parse(geometry);
    } catch {
      return null;
    }
  }

  if (typeof parsed !== 'object' || parsed == null) return null;

  const record = parsed as Record<string, unknown>;
  const coordinates = record.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length === 0) return null;

  const type = String(record.type ?? '').toLowerCase();

  if (type === 'multilinestring' || Array.isArray(coordinates[0]?.[0])) {
    return {
      type: 'MultiLineString',
      coordinates: coordinates as number[][][],
      crs: record.crs as CurbZoneGeometry['crs'],
    };
  }

  if (type === 'linestring' || Array.isArray(coordinates[0])) {
    return {
      type: 'LineString',
      coordinates: coordinates as number[][],
      crs: record.crs as CurbZoneGeometry['crs'],
    };
  }

  return null;
}

export function geometryToPolylines(
  geometry: CurbZoneGeometry | string | null | undefined,
): MapCoordinate[][] {
  const normalized = normalizeZoneGeometry(geometry);
  if (!normalized?.coordinates?.length) return [];

  if (normalized.type === 'MultiLineString') {
    const lines = normalized.coordinates as number[][][];
    return lines
      .map(lineToCoordinates)
      .filter(line => line.length >= 2);
  }

  const line = lineToCoordinates(normalized.coordinates as number[][]);
  return line.length >= 2 ? [line] : [];
}

export function geometryToMapCoordinates(
  geometry: CurbZoneGeometry | string | null | undefined,
): MapCoordinate[] {
  return geometryToPolylines(geometry).flat();
}

export function getRegionFromCoordinates(
  coordinates: MapCoordinate[],
): Region | null {
  if (coordinates.length === 0) return null;

  const lats = coordinates.map(point => point.latitude);
  const lngs = coordinates.map(point => point.longitude);

  const latMin = Math.min(...lats);
  const latMax = Math.max(...lats);
  const lngMin = Math.min(...lngs);
  const lngMax = Math.max(...lngs);

  const latSpan = latMax - latMin;
  const lngSpan = lngMax - lngMin;

  // Short curb segments need a tight viewport so the line is visible.
  const MIN_DELTA = 0.00025;

  return {
    latitude: (latMin + latMax) / 2,
    longitude: (lngMin + lngMax) / 2,
    latitudeDelta: Math.max(latSpan * 8, MIN_DELTA),
    longitudeDelta: Math.max(lngSpan * 8, MIN_DELTA),
  };
}

function extractZoneCandidates(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isNearbyZoneApiItem(payload)) return [payload];
  if (typeof payload !== 'object' || payload == null) return [];

  const record = payload as Record<string, unknown>;
  const keys = [
    'data',
    'results',
    'zones',
    'nearby_zones',
    'curb_zones',
    'items',
  ] as const;

  for (const key of keys) {
    const value = record[key];
    if (value == null) continue;

    if (Array.isArray(value)) return value;
    if (isNearbyZoneApiItem(value)) return [value];

    if (typeof value === 'object') {
      const nested = extractZoneCandidates(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

export function normalizeZonesResponse(response: unknown): CurbZoneItem[] {
  return extractZoneCandidates(response)
    .filter(isNearbyZoneApiItem)
    .map(mapApiZoneToItem);
}

export function getZoneStatusLabel(zone: CurbZoneItem): string {
  if (zone.status === 'full') return 'Full';
  if (zone.status === 'unknown') return 'Unknown';
  return `${zone.available_spaces} Space${zone.available_spaces === 1 ? '' : 's'} Available`;
}

export function getSegmentColor(status: CurbZoneStatus): string {
  if (status === 'full') return '#EC4646';
  if (status === 'unknown') return CURB_ZONE_STATUS_THEME.unknown.dot;
  return '#49B945';
}

function getScheduleStatusText(item: ZoneScheduleApiItem): string {
  return [
    item.activity,
    item.rule,
    item.status,
    item.parking_status,
  ]
    .filter(
      (value): value is string =>
        typeof value === 'string' && value.trim().length > 0,
    )
    .join(' ')
    .toLowerCase();
}

function mapScheduleStatus(
  item: ZoneScheduleApiItem,
  parentIsAllowed?: boolean,
): ScheduleStatus {
  if (parentIsAllowed === false) return 'blocked';
  if (parentIsAllowed === true && item.is_allowed !== false) return 'allowed';

  if (item.is_allowed === true) return 'allowed';
  if (item.is_allowed === false) return 'blocked';

  const text = getScheduleStatusText(item);

  if (
    text.includes('no stopping') ||
    text.includes('no parking') ||
    text.includes('no_parking') ||
    text.includes('tow-away') ||
    text.includes('tow away') ||
    text.includes('block') ||
    text.includes('restrict') ||
    text.includes('denied') ||
    text.includes('prohibited')
  ) {
    return 'blocked';
  }

  if (
    text.includes('allowed') ||
    text.includes('permitted') ||
    text.includes('permit parking')
  ) {
    return 'allowed';
  }

  return 'unknown';
}

function formatScheduleTime(item: ZoneScheduleApiItem): string {
  if (item.time_window) return item.time_window;
  if (item.time_range) return item.time_range;
  if (item.time) return item.time;
  if (item.start_time && item.end_time) {
    return `${item.start_time} – ${item.end_time}`;
  }
  return '—';
}

function formatScheduleDays(item: ZoneScheduleApiItem): string {
  return (
    item.days ??
    item.day_range ??
    item.schedule_days ??
    item.days_of_week ??
    '—'
  );
}

function isZoneScheduleApiItem(value: unknown): value is ZoneScheduleApiItem {
  if (typeof value !== 'object' || value == null) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.rule === 'string' ||
    typeof item.days === 'string' ||
    typeof item.time_window === 'string' ||
    typeof item.title === 'string' ||
    typeof item.rule_name === 'string' ||
    typeof item.policy_name === 'string' ||
    typeof item.name === 'string' ||
    typeof item.policy_id === 'string'
  );
}

function mapScheduleApiItem(
  item: ZoneScheduleApiItem,
  index: number,
  parentIsAllowed?: boolean,
): ScheduleItem {
  return {
    id: `schedule-${index}`,
    title:
      item.rule ??
      item.title ??
      item.rule_name ??
      item.policy_name ??
      item.name ??
      'Parking Rule',
    days: formatScheduleDays(item),
    time: formatScheduleTime(item),
    status: mapScheduleStatus(item, parentIsAllowed),
  };
}

function extractScheduleCandidates(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (isZoneScheduleApiItem(payload)) return [payload];
  if (typeof payload !== 'object' || payload == null) return [];

  const record = payload as Record<string, unknown>;
  const keys = [
    'weekly_schedule',
    'schedule',
    'schedules',
    'items',
    'results',
    'data',
    'zone_schedule',
  ] as const;

  for (const key of keys) {
    const value = record[key];
    if (value == null) continue;

    if (Array.isArray(value)) return value;
    if (isZoneScheduleApiItem(value)) return [value];

    if (typeof value === 'object') {
      const nested = extractScheduleCandidates(value);
      if (nested.length > 0) return nested;
    }
  }

  return [];
}

function extractGoverningRule(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload == null) return null;

  const record = payload as Record<string, unknown>;
  const keys = [
    'governing_rule',
    'primary_governing_rule',
    'primary_rule',
    'rule',
  ] as const;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  const data = record.data;
  if (typeof data === 'object' && data != null) {
    return extractGoverningRule(data);
  }

  return null;
}

function extractTargetLineColor(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload == null) return null;

  const record = payload as Record<string, unknown>;
  const color = record.target_line_color;

  if (typeof color === 'string' && color.trim()) {
    return color;
  }

  const data = record.data;
  if (typeof data === 'object' && data != null) {
    return extractTargetLineColor(data);
  }

  return null;
}

export function normalizeZoneScheduleResponse(
  response: unknown,
): ZoneScheduleResult {
  return {
    governing_rule: extractGoverningRule(response),
    target_line_color: extractTargetLineColor(response),
    schedule: extractScheduleCandidates(response)
      .filter(isZoneScheduleApiItem)
      .map((item, index) => mapScheduleApiItem(item, index)),
  };
}
