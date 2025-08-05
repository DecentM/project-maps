import { log } from '@project-maps/logging'
import OpeningHours, { type nominatim_object as Nominatim } from 'opening_hours'
import { DateTime } from 'luxon'
import GeoTz from 'geo-tz'

type OpeningHourInterval = {
  from: DateTime
  to: DateTime
  uncertain: boolean
  comment?: string
}

type ParsedOpeningHours = {
  intervals: OpeningHourInterval[]
  isWeekStable: boolean
  isCurrentlyOpen: boolean
  tz?: string
  nextChange?: DateTime
  is247?: boolean
}

export const parseOpeningHours = (
  openingHours: string,
  nominatim: Nominatim
): ParsedOpeningHours | undefined => {
  try {
    const [tz] = GeoTz.find(nominatim.lat, nominatim.lon)

    if (openingHours === '24/7') {
      return {
        is247: true,
        isCurrentlyOpen: true,
        isWeekStable: true,
        tz,
        intervals: [],
      }
    }

    if (openingHours.startsWith('"') && openingHours.endsWith('"')) {
      openingHours = openingHours.slice(1, -1)
    }

    const oh = new OpeningHours(openingHours, nominatim)
    const now = DateTime.now()

    const ranges = oh.getOpenIntervals(now.startOf('week').toJSDate(), now.endOf('week').toJSDate())

    const result: ParsedOpeningHours = {
      intervals: [],
      isWeekStable: oh.isWeekStable(),
      isCurrentlyOpen: oh.getState(now.toJSDate()),
      nextChange: undefined,
      tz,
      is247: undefined,
    }

    const nextChange = oh.getNextChange(now.toJSDate())
    result.nextChange =
      nextChange && DateTime.fromJSDate(nextChange).setZone(tz, { keepLocalTime: true })

    for (const [from, to, uncertain, comment] of ranges) {
      result.intervals.push({
        from: DateTime.fromJSDate(from).setZone(tz, { keepLocalTime: true }),
        to: DateTime.fromJSDate(to).setZone(tz, { keepLocalTime: true }),
        uncertain,
        comment,
      })
    }

    return result
  } catch (error) {
    log.error(error, 'Failed to parse opening hours')
    return undefined
  }
}
