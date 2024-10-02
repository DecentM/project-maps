import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import test from 'ava'
import { DateTime, Interval } from 'luxon'

import * as OpeningHours from './index'

const macro = test.macro<[string, unknown]>((t, input, expected) => {
  const openingHours = OpeningHours.parse(
    input,
    Interval.after(DateTime.fromFormat('2024-09-27', 'yyyy-MM-dd').startOf('week'), { days: 7 }),
    DateTime.local().zone
  )

  const result = openingHours.map((oh) => ({
    start: oh.start.toFormat('yyyy-MM-dd (EEE) HH:mm'),
    end: oh.end.toFormat('yyyy-MM-dd (EEE) HH:mm'),
    unknown: oh.unknown,
    detail: oh.detail,
  }))

  t.deepEqual(result, expected)
})

test('parses basic opening hours', macro, 'Mo-Fr 08:00-17:00', [
  {
    start: '2024-09-23 (Mon) 08:00',
    end: '2024-09-23 (Mon) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-24 (Tue) 08:00',
    end: '2024-09-24 (Tue) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-25 (Wed) 08:00',
    end: '2024-09-25 (Wed) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-26 (Thu) 08:00',
    end: '2024-09-26 (Thu) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-27 (Fri) 08:00',
    end: '2024-09-27 (Fri) 17:00',
    unknown: false,
    detail: undefined,
  },
])

test('parses basic opening hours with closed day', macro, 'Mo-Fr 08:00-17:00; Sa-Su off; We off;', [
  {
    start: '2024-09-23 (Mon) 08:00',
    end: '2024-09-23 (Mon) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-24 (Tue) 08:00',
    end: '2024-09-24 (Tue) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-26 (Thu) 08:00',
    end: '2024-09-26 (Thu) 17:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-27 (Fri) 08:00',
    end: '2024-09-27 (Fri) 17:00',
    unknown: false,
    detail: undefined,
  },
])

test('parses 24/7', macro, '24/7', [
  {
    start: '2024-09-23 (Mon) 00:00',
    end: '2024-09-30 (Mon) 00:00',
    unknown: false,
    detail: undefined,
  },
])

test('parses sunday difference', macro, 'Mo-Sa 06:00-22:00; Su 10:00-16:00', [
  {
    start: '2024-09-23 (Mon) 06:00',
    end: '2024-09-23 (Mon) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-24 (Tue) 06:00',
    end: '2024-09-24 (Tue) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-25 (Wed) 06:00',
    end: '2024-09-25 (Wed) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-26 (Thu) 06:00',
    end: '2024-09-26 (Thu) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-27 (Fri) 06:00',
    end: '2024-09-27 (Fri) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-28 (Sat) 06:00',
    end: '2024-09-28 (Sat) 22:00',
    unknown: false,
    detail: undefined,
  },
  {
    start: '2024-09-29 (Sun) 10:00',
    end: '2024-09-29 (Sun) 16:00',
    unknown: false,
    detail: undefined,
  },
])

test('parses test file', (t) => {
  const testdata = fs
    .readFileSync(path.resolve(path.resolve('test', 'fixtures', 'index.spec.testdata.txt')), 'utf8')
    .split('\n')

  let parsed = 0

  for (const line of testdata) {
    try {
      const result = OpeningHours.parse(
        line,
        Interval.after(DateTime.fromFormat('2024-09-27', 'yyyy-MM-dd').startOf('week'), {
          days: 7,
        }),
        DateTime.local().zone
      )

      for (const item of result) {
        if (!item.start || !item.end || !item.start.isValid || !item.end.isValid) {
          throw new Error('Invalid date')
        }
      }

      parsed++
    } catch {
      // If an error is thrown, the count will not be incremented, so at this
      // point the error already served its purpose
    }
  }

  const parsedPct = (parsed / testdata.length) * 100
  const minParsedPct = 80

  t.log(`Parsed ${parsed} of ${testdata.length} (${parsedPct.toFixed(2)}% > ${minParsedPct}%)`)
  t.snapshot(parsedPct)
})
