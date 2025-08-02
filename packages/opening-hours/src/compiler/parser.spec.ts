import test from 'node:test'
import assert from 'node:assert'

import { parse } from './parser.js'
import { Token } from './lexer.js'

test('parser', () => {
  const input: Token[] = [
    { type: 'word', value: 'Mon' },
    { type: 'dash' },
    { type: 'word', value: 'Fri' },
    { type: 'number', value: '12' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'dash' },
    { type: 'number', value: '23' },
    { type: 'colon' },
    { type: 'number', value: '30' },
  ]

  const expected = {
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
        end: { hour: 23, minute: 30 },
      },
    ],
  }

  assert.deepEqual(parse(input), expected)
})
