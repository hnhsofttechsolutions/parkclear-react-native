import { ImagePickerResponse } from 'react-native-image-picker';
import Share from 'react-native-share';

export const pickerOptions = {
  mediaType: 'photo' as const,
  quality: 0.9 as const,
  includeBase64: false,
};

export function uriFromResponse(res: ImagePickerResponse): string | null {
  const a = res.assets?.[0];
  return a?.uri ?? null;
}

export const formatTimeToAMPM = (time: any): string => {
  if (!time) return 'Select Time';
  let dateObj = typeof time === 'string' ? new Date(time) : time;
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return 'Select Time';
  }
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  return `${hours}:${minutesStr} ${ampm}`;
};

export const formatDateToYYYYMMDD = (date: Date | null) => {
  if (!date) return 'Select Date';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
};

export const shareApp = async () => {
  const shareOptions = {
    title: 'ParkClear App',
    message: `Confusing Parking Signs? ParkClear can Help!
Download App:
https://play.google.com/store/apps/details?id=com.app.parkclear&pcampaignid=web_share`,
  };
  try {
    await Share.open(shareOptions);
  } catch (error) {
    console.log(error);
  }
};
