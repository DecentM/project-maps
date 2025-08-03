import assert from 'node:assert'
import test from 'node:test'

import { lex } from './lexer.js'
import { type Ast, parse } from './parser.js'

const macro = (name: string, value: string, expected: Ast) => {
  test(name, () => {
    assert.deepEqual(parse(lex(value)), expected)
  })
}

macro(
  'kitchensink',
  'Mo 08:00-16:00; Mo[-2] 08:00-12:00;\n Dec 12 off;PH 08:00-16:00+; SH 10:00-14:00;Jan 12-14 24/7; Aug sunrise-sunset; easter -2 days off',
  {
    type: 'root',
    children: [
      {
        type: 'singleDay',
        day: 'Mo',
      },
      {
        type: 'timeRange',
        start: {
          hour: 8,
          minute: 0,
        },
        end: {
          hour: 16,
          minute: 0,
          isNextDay: false,
          isAmbiguous: false,
        },
      },
      {
        type: 'singleDay',
        day: 'Mo',
      },
      {
        type: 'timeRange',
        start: {
          hour: 8,
          minute: 0,
        },
        end: {
          hour: 12,
          minute: 0,
          isNextDay: false,
          isAmbiguous: false,
        },
      },
      {
        type: 'singleMonth',
        month: 'Dec',
      },
      {
        type: 'singleDay',
        day: 12,
      },
      {
        type: 'off',
      },
      {
        type: 'singleDay',
        day: 'PH',
      },
      {
        type: 'timeRange',
        start: {
          hour: 8,
          minute: 0,
        },
        end: {
          hour: 16,
          minute: 0,
          isNextDay: false,
          isAmbiguous: true,
        },
      },
      {
        type: 'singleDay',
        day: 'SH',
      },
      {
        type: 'timeRange',
        start: {
          hour: 10,
          minute: 0,
        },
        end: {
          hour: 14,
          minute: 0,
          isNextDay: false,
          isAmbiguous: false,
        },
      },
      {
        type: 'singleMonth',
        month: 'Jan',
      },
      {
        type: 'dayRange',
        start: 12,
        end: 14,
      },
      {
        type: 'twentyFourSeven',
      },
      {
        type: 'singleMonth',
        month: 'Aug',
      },
      {
        type: 'timeRange',
        start: 'sunrise',
        end: 'sunset',
      },
      {
        type: 'fest',
        value: 'easter',
      },
      {
        type: 'offset',
        value: -2,
        unit: 'days',
      },
      {
        type: 'off',
      },
    ],
  }
)

macro('Wd-Wd hh:mm-hh:mm', 'Mon-Fri 12:00-23:30', {
  type: 'root',
  children: [
    {
      type: 'dayRange',
      start: 'Mo',
      end: 'Fr',
    },
    {
      type: 'timeRange',
      start: { hour: 12, minute: 0 },
      end: { hour: 23, minute: 30, isNextDay: false, isAmbiguous: false },
    },
  ],
})

macro('Wd hh:mm-hh:mm (next day end)', 'Mon 12:00-26:30', {
  type: 'root',
  children: [
    {
      type: 'singleDay',
      day: 'Mo',
    },
    {
      type: 'timeRange',
      start: { hour: 12, minute: 0 },
      end: { hour: 2, minute: 30, isNextDay: true, isAmbiguous: false },
    },
  ],
})

macro('Wd,Wd,Wd', 'Mo,Tu,We', {
  type: 'root',
  children: [
    {
      type: 'singleDay',
      day: 'Mo',
    },
    {
      type: 'singleDay',
      day: 'Tu',
    },
    {
      type: 'singleDay',
      day: 'We',
    },
  ],
})
