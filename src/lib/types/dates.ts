export function getEarliestDate(
  year: number,
  month?: number | null,
  day?: number | null
): Date {
  const m = month != null ? month - 1 : 0; // JS Date: month is 0-indexed
  const d = day != null ? day : 1;
  return new Date(year, m, d);
}

export function getLatestDate(
  year: number,
  month?: number | null,
  day?: number | null
): Date {
  if (month != null) {
    if (day != null) {
      return new Date(year, month - 1, day);
    } else {
      // Get last day of the month using next month's 0th day
      return new Date(year, month, 0);
    }
  } else {
    // If no month, return December 31
    return new Date(year, 11, 31);
  }
}
