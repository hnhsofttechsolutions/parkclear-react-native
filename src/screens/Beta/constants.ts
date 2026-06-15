import type { Region } from 'react-native-maps';
import type {
  CurbZoneItem,
  CurbZoneStatus,
  CurbZoneStatusTheme,
  ScheduleItem,
  ScheduleStatus,
  SegmentPolyline,
} from './types';

export const NEARBY_RADIUS_METERS = '1000';

export const TEST_MAP_LAT = 34.039333;
export const TEST_MAP_LNG = -118.252633;

export const CURB_ZONE_STATUS_THEME: Record<
  CurbZoneStatus,
  CurbZoneStatusTheme
> = {
  available: {
    accent: '#49B945',
    badgeBg: '#E8F8E8',
    badgeText: '#2E8B2E',
    dot: '#49B945',
    glow: 'rgba(73, 185, 69, 0.35)',
  },
  unknown: {
    accent: '#302f26',
    badgeBg: '#f5f5f5',
    badgeText: '#302f26',
    dot: '#302f26',
    glow: 'rgba(48, 47, 38, 0.25)',
  },
  full: {
    accent: '#EC4646',
    badgeBg: '#FFE8E8',
    badgeText: '#D93030',
    dot: '#EC4646',
    glow: 'rgba(236, 70, 70, 0.35)',
  },
};

export const MAP_LEGEND = [
  { key: 'allowed', label: 'Allowed', color: '#49B945' },
  { key: 'unknown', label: 'Unknown', color: '#302f26' },
  { key: 'blocked', label: 'No parking', color: '#EC4646' },
] as const;

export const SCHEDULE_THEME: Record<
  ScheduleStatus,
  { badgeBg: string; badgeText: string; label: string }
> = {
  allowed: {
    badgeBg: '#E8F8E8',
    badgeText: '#2E8B2E',
    label: 'Allowed',
  },
  blocked: {
    badgeBg: '#FFE8E8',
    badgeText: '#D93030',
    label: 'Blocked',
  },
  unknown: {
    badgeBg: CURB_ZONE_STATUS_THEME.unknown.badgeBg,
    badgeText: CURB_ZONE_STATUS_THEME.unknown.badgeText,
    label: 'Unknown',
  },
};

export const DEFAULT_CURB_ZONE: CurbZoneItem = {
  curb_zone_id: '1',
  street_name: 'WEST OLYMPIC BOULEVARD',
  parking_angle: 'parallel',
  parking_type_label: 'Parallel Parking',
  available_spaces: 2,
  status: 'available',
  curb_policy_ids: [],
  geometry: null,
  rules: [],
  target_line_color: null,
  primary_governing_rule: null,
};

export const MOCK_SCHEDULE: ScheduleItem[] = [
  {
    id: '1',
    title: 'Standard Street Access',
    days: 'Mon – Sun',
    time: '12:00 AM – 11:59 PM',
    status: 'allowed',
  },
  {
    id: '2',
    title: 'No Stopping Restrictions',
    days: 'Mon – Fri',
    time: '12:00 AM – 11:59 PM',
    status: 'blocked',
  },
];

export const INITIAL_MAP_REGION: Region = {
  latitude: 34.044673,
  longitude: -118.238115,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

export const FALLBACK_SEGMENT_POLYLINES: SegmentPolyline[] = [
  {
    id: 'allowed',
    color: '#49B945',
    coordinates: [
      { latitude: 34.0459, longitude: -118.2398 },
      { latitude: 34.0452, longitude: -118.2384 },
      { latitude: 34.0445, longitude: -118.2371 },
    ],
  },
  {
    id: 'unknown',
    color: '#302f26',
    coordinates: [
      { latitude: 34.0445, longitude: -118.2371 },
      { latitude: 34.0438, longitude: -118.2358 },
      { latitude: 34.0431, longitude: -118.2345 },
    ],
  },
  {
    id: 'blocked',
    color: '#EC4646',
    coordinates: [
      { latitude: 34.0431, longitude: -118.2345 },
      { latitude: 34.0424, longitude: -118.2332 },
      { latitude: 34.0417, longitude: -118.2319 },
    ],
  },
];
