import { DateTime, Interval } from 'luxon'

import { Ast, DayRange, isCustomTime, parse } from '../parser.js'
import { lex } from '../lexer.js'
import { TransformationError } from '../errors.js'
import {
  Day,
  DayOfMonth,
  DayOfWeek,
  isDayOfMonth,
  isDayOfWeek,
  Month,
} from '../../opening-hours.js'
import { getDaysInMonth } from './months.js'

const DaysOfWeek = Object.values(DayOfWeek)

const expandDayRange = <T extends Day | DayOfMonth>(
  range: DayRange,
  month: Month,
  year: number
): T[] => {
  if (isDayOfWeek(range.start) && isDayOfWeek(range.end)) {
    let cursor = range.start
    const result: Day[] = []

    while (cursor !== range.end) {
      result.push(cursor)
      cursor = DaysOfWeek[DaysOfWeek.indexOf(cursor) + (cursor === 'Su' ? -6 : 1)]
    }

    result.push(range.end)

    return result as T[]
  }

  if (isDayOfMonth(range.start) && isDayOfMonth(range.end)) {
    let cursor = range.start
    const result: DayOfMonth[] = []

    while (cursor !== range.end) {
      result.push(cursor)

      if (cursor === getDaysInMonth(month, { year })) {
        cursor = 1
      } else {
        cursor += 1
      }
    }

    result.push(range.end)

    return result as T[]
  }

  throw new TransformationError(`Invalid day range: ${JSON.stringify(range)}`)
}

export class OpeningHours {
  private constructor(private ast: Ast) {}

  public static fromString(input: string): OpeningHours {
    const ast = parse(lex(input))

    return new OpeningHours(ast)
  }

  public getIntervals(): Interval[] {
    const result: Interval[] = []

    for (const node of this.ast.children) {
      if (node.type === 'timeRange') {
        if (isCustomTime(node.start)) {
          throw new TransformationError(`Custom start time "${node.start}" is not implemented`)
        }

        if (isCustomTime(node.end)) {
          throw new TransformationError(`Custom end time "${node.end}" is not implemented`)
        }

        const start = DateTime.fromObject({
          hour: node.start.hour,
          minute: node.start.minute,
        })

        let end: DateTime | undefined

        if (node.end) {
          end = DateTime.fromObject({
            hour: node.end.hour,
            minute: node.end.minute,
          })

          if (node.end.isNextDay) {
            result.push(Interval.fromDateTimes(start, end.plus({ days: 1 })))
          } else {
            result.push(Interval.fromDateTimes(start, end))
          }

          continue
        }
      }
    }

    return result
  }
}

console.log(expandDayRange({ type: 'dayRange', start: 26, end: 4 }, 'Feb', 2023))
// console.log(OpeningHours.fromString('Mo-Fr 08:00-18:00').getIntervals())
