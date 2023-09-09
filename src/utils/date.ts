import { siteConfig } from '@/site-config';

const dateFormat = new Intl.DateTimeFormat(undefined, siteConfig.date.options);

export function getFormattedDate(date: string | number | Date) {
  return dateFormat.format(new Date(date));
}

export function isSameDay(dateA: Date, dateB: Date) {
  return getFormattedDate(dateA) === getFormattedDate(dateB);
}
