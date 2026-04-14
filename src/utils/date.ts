import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

// Set Vietnamese locale as default
dayjs.locale('vi');

export type DateInput = string | Date | undefined | null;

export interface DateFormatOptions {
  format?: string;
  locale?: string;
  fallback?: string;
}

/**
 * Format date with configurable options
 * @param date - Date input (string, Date, undefined, or null)
 * @param options - Formatting options
 * @returns Formatted date string or fallback value
 */
export function formatDate(
  date: DateInput,
  options: DateFormatOptions = {}
): string {
  const {
    format = 'DD/MM/YYYY',
    locale = 'vi',
    fallback = 'N/A'
  } = options;

  // Handle null, undefined, or empty string
  if (!date) {
    return fallback;
  }

  try {
    // Parse the date
    const parsedDate = dayjs(date);
    
    // Check if date is valid
    if (!parsedDate.isValid()) {
      return fallback;
    }

    // Set locale if different from current
    if (locale !== dayjs.locale()) {
      dayjs.locale(locale);
    }

    // Format the date
    return parsedDate.format(format);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return fallback;
  }
}

/**
 * Predefined format functions for common use cases
 */
export const dateFormats = {
  // Vietnamese formats
  short: (date: DateInput) => formatDate(date, { format: 'DD/MM/YYYY' }),
  long: (date: DateInput) => formatDate(date, { format: 'DD [tháng] MM [năm] YYYY' }),
  full: (date: DateInput) => formatDate(date, { format: 'dddd, DD [tháng] MM [năm] YYYY' }),
  time: (date: DateInput) => formatDate(date, { format: 'HH:mm' }),
  datetime: (date: DateInput) => formatDate(date, { format: 'DD/MM/YYYY HH:mm' }),
  
  // International formats
  iso: (date: DateInput) => formatDate(date, { format: 'YYYY-MM-DD' }),
  us: (date: DateInput) => formatDate(date, { format: 'MM/DD/YYYY', locale: 'en' }),
  uk: (date: DateInput) => formatDate(date, { format: 'DD/MM/YYYY', locale: 'en-gb' }),
  
  // Relative formats
  fromNow: (date: DateInput) => {
    if (!date) return 'N/A';
    const parsed = dayjs(date);
    return parsed.isValid() ? parsed.fromNow() : 'N/A';
  },
  
  // Custom format with locale
  custom: (date: DateInput, format: string, locale = 'vi') => 
    formatDate(date, { format, locale })
};

/**
 * Get relative time (e.g., "2 giờ trước", "3 ngày trước")
 */
export function getRelativeTime(date: DateInput): string {
  if (!date) return 'N/A';
  
  const parsed = dayjs(date);
  if (!parsed.isValid()) return 'N/A';
  
  return parsed.fromNow();
}

/**
 * Check if date is today
 */
export function isToday(date: DateInput): boolean {
  if (!date) return false;
  
  const parsed = dayjs(date);
  return parsed.isValid() && parsed.isSame(dayjs(), 'day');
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: DateInput): boolean {
  if (!date) return false;
  
  const parsed = dayjs(date);
  return parsed.isValid() && parsed.isSame(dayjs().subtract(1, 'day'), 'day');
}

/**
 * Get date range text (e.g., "Hôm nay", "Hôm qua", "2 ngày trước")
 */
export function getDateRangeText(date: DateInput): string {
  if (!date) return 'N/A';
  
  if (isToday(date)) return 'Hôm nay';
  if (isYesterday(date)) return 'Hôm qua';
  
  return getRelativeTime(date);
}

/**
 * Format kiểu: "19 giờ trước", "hôm qua", "2 ngày trước".
 * Nếu lớn hơn 7 ngày thì hiển thị ngày giờ cụ thể "HH:mm DD/MM/YYYY".
 */
export function formatRelative(date: DateInput, fallback = "—"): string {
  if (!date) return fallback;
  const parsed = dayjs(date);
  if (!parsed.isValid()) return fallback;

  if (isToday(date)) {
    // within today: minutes/hours ago
    return parsed.fromNow();
  }

  if (isYesterday(date)) return "Hôm qua";

  const diffDays = dayjs().diff(parsed, "day");
  if (diffDays >= 7) {
    return parsed.format("HH:mm DD/MM/YYYY");
  }

  // 2-6 days ago
  return `${diffDays} ngày trước`;
}
