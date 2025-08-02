export const Day = {
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
  Sunday: 'Sun',
  Everyday: 'E',
  Weekend: 'WE',
  Weekday: 'WD',
  PublicHoliday: 'PH',
  SchoolHoliday: 'SH',
} as const

export type Day = (typeof Day)[keyof typeof Day]
