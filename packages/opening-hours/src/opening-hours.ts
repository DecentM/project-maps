type Enumerate<
  N extends number,
  Accumulator extends number[] = [],
> = Accumulator['length'] extends N
  ? Accumulator[number]
  : Enumerate<N, [...Accumulator, Accumulator['length']]>

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export const DayOfWeek = {
  Monday: 'Mo',
  Tuesday: 'Tu',
  Wednesday: 'We',
  Thursday: 'Th',
  Friday: 'Fr',
  Saturday: 'Sa',
  Sunday: 'Su',
} as const

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek]

export const isDayOfWeek = (input: unknown): input is DayOfWeek => {
  if (typeof input !== 'string') {
    return false
  }

  return Object.values(DayOfWeek).includes(input as DayOfWeek)
}

export const Day = {
  ...DayOfWeek,
  Everyday: 'e',
  Weekend: 'we',
  Weekday: 'wd',
  PublicHoliday: 'PH',
  SchoolHoliday: 'SH',
} as const

export type Day = (typeof Day)[keyof typeof Day]

export const isDay = (input: unknown): input is Day => {
  if (typeof input !== 'string') {
    return false
  }

  return Object.values(Day).includes(input as Day)
}

export type Hour = Range<0, 24>

export type Minute = Range<0, 60>

export const isHour = (input: unknown): input is Hour => {
  if (typeof input !== 'number') {
    return false
  }

  return input >= 0 && input < 24
}

export const isMinute = (input: unknown): input is Minute => {
  if (typeof input !== 'number') {
    return false
  }

  return input >= 0 && input < 60
}

export const Month = {
  January: 'Jan',
  February: 'Feb',
  March: 'Mar',
  April: 'Apr',
  May: 'May',
  June: 'Jun',
  July: 'Jul',
  August: 'Aug',
  September: 'Sep',
  October: 'Oct',
  November: 'Nov',
  December: 'Dec',
} as const

export type Month = (typeof Month)[keyof typeof Month]

export const isMonth = (input: unknown): input is Month => {
  if (typeof input !== 'string') {
    return false
  }

  return Object.values(Month).includes(input as Month)
}

export type DayOfMonth = Range<1, 32>

export const isDayOfMonth = (input: unknown): input is DayOfMonth => {
  if (typeof input !== 'number') {
    return false
  }

  return input >= 1 && input <= 31
}
