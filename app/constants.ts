import { Photo } from "@prisma/client";

// Pixel GIF code adapted from https://stackoverflow.com/a/33919020/266535
const keyStr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

const triplet = (e1: number, e2: number, e3: number) =>
  keyStr.charAt(e1 >> 2) +
  keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
  keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
  keyStr.charAt(e3 & 63);

export const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;

// list of months in French
export const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
] as const;

// Mapping of month names to their corresponding numbers (1-12)
export const MONTH_TO_NUMBER: Record<Photo["month"], number> = {
  janvier: 1,
  février: 2,
  mars: 3,
  avril: 4,
  mai: 5,
  juin: 6,
  juillet: 7,
  août: 8,
  septembre: 9,
  octobre: 10,
  novembre: 11,
  décembre: 12,
};

/**
 * Convert a month name in French to its corresponding number (1-12)
 * @param month - the month name in French (e.g., "janvier", "février", etc.)
 * @returns the number corresponding to the month (1 for janvier, 2 for février, ..., 12 for décembre), or 0 if the month name is invalid
 */
export const getMonthNumber = (month: string): number => {
  const monthLower = month.toLowerCase() as Photo["month"];
  return MONTH_TO_NUMBER[monthLower] || 0;
};

/**
 * compare two photos by their date (year and month) in descending order (most recent first)
 * @param a - first photo to compare
 * @param b - second photo to compare
 * @returns negaltive number if a is more recent than b, positive number if b is more recent than a, or 0 if they have the same date
 */
export const sortPhotosByDateDesc = (
  a: { year: string; month: string },
  b: { year: string; month: string },
): number => {
  // compare by year first
  const yearDiff = parseInt(b.year) - parseInt(a.year);
  if (yearDiff !== 0) return yearDiff;

  // if same year, compare by month
  return getMonthNumber(b.month) - getMonthNumber(a.month);
};
