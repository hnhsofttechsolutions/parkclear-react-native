export type CurbZoneStatus = 'available' | 'limited' | 'full';

export type CurbZoneGeometry = {
  type: 'MultiLineString' | 'LineString';
  crs?: {
    type: string;
    properties: { name: string };
  };
  coordinates: number[][][] | number[][];
};

export type ZoneRule = {
  status?: string;
  target_line_color?: string;
  primary_governing_rule?: string;
  weekly_schedule?: ZoneScheduleApiItem[];
};

export type NearbyZoneApiItem = {
  curb_zone_id: string;
  street_name: string;
  parking_angle: string;
  available_spaces: number;
  curb_policy_ids: string[];
  geometry: CurbZoneGeometry;
  rules?: ZoneRule[];
};

export type CurbZoneItem = {
  curb_zone_id: string;
  street_name: string;
  parking_angle: string;
  parking_type_label: string;
  available_spaces: number;
  status: CurbZoneStatus;
  curb_policy_ids: string[];
  geometry: CurbZoneGeometry | null;
  rules: ZoneRule[];
  target_line_color: string | null;
  primary_governing_rule: string | null;
};

export type ParkMapPolyline = {
  id: string;
  zone: CurbZoneItem;
  coordinates: MapCoordinate[];
  color: string;
};

export type ParkMapRouteParams = {
  lat?: number;
  lng?: number;
  radius?: number;
};

export type CurbZoneStatusTheme = {
  accent: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
  glow: string;
};

export type SelectCurbZoneRouteParams = {
  zones?: CurbZoneItem[];
  lat?: number;
  lng?: number;
  radius?: number;
};

export type CurbSegmentRouteParams = {
  zone?: CurbZoneItem;
};

export type ScheduleStatus = 'allowed' | 'blocked';

export type ScheduleItem = {
  id: string;
  title: string;
  days: string;
  time: string;
  status: ScheduleStatus;
};

export type ZoneScheduleApiItem = {
  days?: string;
  time_window?: string;
  rule?: string;
  activity?: string;
  is_allowed?: boolean;
  policy_id?: string;
  title?: string;
  rule_name?: string;
  policy_name?: string;
  name?: string;
  day_range?: string;
  schedule_days?: string;
  days_of_week?: string;
  time?: string;
  time_range?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  parking_status?: string;
};

export type ZoneScheduleResult = {
  governing_rule: string | null;
  target_line_color: string | null;
  schedule: ScheduleItem[];
};

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type SegmentPolyline = {
  id: string;
  color: string;
  coordinates: MapCoordinate[];
};
