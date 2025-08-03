import { Month } from '../../opening-hours.js'

type MonthContext = {
  year: number
}

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

type MonthData = (context: MonthContext) => {
  name: Month
  days: number
}

export const January: MonthData = () => ({
  name: Month.January,
  days: 31,
})

export const February: MonthData = (context) => ({
  name: Month.February,
  days: isLeapYear(context.year) ? 29 : 28,
})

export const March: MonthData = () => ({
  name: Month.March,
  days: 31,
})

export const April: MonthData = () => ({
  name: Month.April,
  days: 30,
})

export const May: MonthData = () => ({
  name: Month.May,
  days: 31,
})

export const June: MonthData = () => ({
  name: Month.June,
  days: 30,
})

export const July: MonthData = () => ({
  name: Month.July,
  days: 31,
})

export const August: MonthData = () => ({
  name: Month.August,
  days: 31,
})

export const September: MonthData = () => ({
  name: Month.September,
  days: 30,
})

export const October: MonthData = () => ({
  name: Month.October,
  days: 31,
})

export const November: MonthData = () => ({
  name: Month.November,
  days: 30,
})

export const December: MonthData = () => ({
  name: Month.December,
  days: 31,
})

export const getDaysInMonth = (month: Month, context: MonthContext): number => {
  switch (month) {
    case Month.January:
      return January(context).days
    case Month.February:
      return February(context).days
    case Month.March:
      return March(context).days
    case Month.April:
      return April(context).days
    case Month.May:
      return May(context).days
    case Month.June:
      return June(context).days
    case Month.July:
      return July(context).days
    case Month.August:
      return August(context).days
    case Month.September:
      return September(context).days
    case Month.October:
      return October(context).days
    case Month.November:
      return November(context).days
    case Month.December:
      return December(context).days
  }
}
