import OpeningHours from 'opening_hours'
import { DateTime, type Zone, type Interval } from 'luxon'
import VError from 'verror'

export const parse = (openingHours: string, interval: Interval, zone: Zone) => {
  if (!interval.start || !interval.end)
    throw new VError('Interval must have start and end', interval)

  const oh = new OpeningHours(openingHours)
  const result = oh.getOpenIntervals(interval.start.toJSDate(), interval.end.toJSDate())

  console.log(zone)

  return result
    .map(([start, end, unknown, detail]) => {
      if (!start || !end) return null

      return {
        start: DateTime.fromJSDate(start, { zone }),
        end: DateTime.fromJSDate(end, { zone }),
        unknown,
        detail,
      }
    })
    .filter((item) => item !== null)
}
