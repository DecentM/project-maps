import test from 'node:test'
import assert from 'node:assert'

import { Ast, parse } from './parser.js'
import { TokenEnvelope } from './lexer.js'

test('parser', () => {
  const input: TokenEnvelope[] = [
    { value: { type: 'word', value: 'Mon' }, start: 3, length: 3 },
    { value: { type: 'dash' }, start: 3, length: 1 },
    { value: { type: 'word', value: 'Fri' }, start: 7, length: 3 },
    { value: { type: 'space' }, start: 7, length: 1 },
    { value: { type: 'number', value: '12' }, start: 10, length: 2 },
    { value: { type: 'colon' }, start: 10, length: 1 },
    { value: { type: 'number', value: '00' }, start: 13, length: 2 },
    { value: { type: 'dash' }, start: 13, length: 1 },
    { value: { type: 'number', value: '23' }, start: 16, length: 2 },
    { value: { type: 'colon' }, start: 16, length: 1 },
    { value: { type: 'number', value: '30' }, start: 19, length: 2 }
  ]

  const expected: Ast = {
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
