import test from 'node:test'
import assert from 'node:assert'

import { lex } from './lexer.js'

test('lexer', () => {
  const input = 'Mon-Fri 12:00-23:30'

  const expected = [
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

  assert.deepEqual(lex(input), expected)
})

test('kitchensink', () => {
  const input =
    'Mo 08:00-16:00; Mo[-2] 08:00-12:00;\n Dec 12 off;PH 08:00-16:00+; SH 10:00-14:00;Jan 12-14 24/7; Aug sunrise-sunset; easter -2 days off'

  const expected = [
    { value: { type: 'word', value: 'Mo' }, start: 2, length: 2 },
    { value: { type: 'space' }, start: 2, length: 1 },
    { value: { type: 'number', value: '08' }, start: 5, length: 2 },
    { value: { type: 'colon' }, start: 5, length: 1 },
    { value: { type: 'number', value: '00' }, start: 8, length: 2 },
    { value: { type: 'dash' }, start: 8, length: 1 },
    { value: { type: 'number', value: '16' }, start: 11, length: 2 },
    { value: { type: 'colon' }, start: 11, length: 1 },
    { value: { type: 'number', value: '00' }, start: 14, length: 2 },
    { value: { type: 'semicolon' }, start: 14, length: 1 },
    { value: { type: 'space' }, start: 15, length: 1 },
    { value: { type: 'word', value: 'Mo' }, start: 18, length: 2 },
    { value: { type: 'squareBracket', value: 'open' }, start: 19, length: 1 },
    { value: { type: 'dash' }, start: 19, length: 1 },
    { value: { type: 'number', value: '2' }, start: 21, length: 1 },
    { value: { type: 'squareBracket', value: 'close' }, start: 22, length: 1 },
    { value: { type: 'space' }, start: 22, length: 1 },
    { value: { type: 'number', value: '08' }, start: 25, length: 2 },
    { value: { type: 'colon' }, start: 25, length: 1 },
    { value: { type: 'number', value: '00' }, start: 28, length: 2 },
    { value: { type: 'dash' }, start: 28, length: 1 },
    { value: { type: 'number', value: '12' }, start: 31, length: 2 },
    { value: { type: 'colon' }, start: 31, length: 1 },
    { value: { type: 'number', value: '00' }, start: 34, length: 2 },
    { value: { type: 'semicolon' }, start: 34, length: 1 },
    { value: { type: 'newline' }, start: 35, length: 1 },
    { value: { type: 'space' }, start: 36, length: 1 },
    { value: { type: 'word', value: 'Dec' }, start: 40, length: 3 },
    { value: { type: 'space' }, start: 40, length: 1 },
    { value: { type: 'number', value: '12' }, start: 43, length: 2 },
    { value: { type: 'space' }, start: 43, length: 1 },
    { value: { type: 'word', value: 'off' }, start: 47, length: 3 },
    { value: { type: 'semicolon' }, start: 47, length: 1 },
    { value: { type: 'word', value: 'PH' }, start: 50, length: 2 },
    { value: { type: 'space' }, start: 50, length: 1 },
    { value: { type: 'number', value: '08' }, start: 53, length: 2 },
    { value: { type: 'colon' }, start: 53, length: 1 },
    { value: { type: 'number', value: '00' }, start: 56, length: 2 },
    { value: { type: 'dash' }, start: 56, length: 1 },
    { value: { type: 'number', value: '16' }, start: 59, length: 2 },
    { value: { type: 'colon' }, start: 59, length: 1 },
    { value: { type: 'number', value: '00' }, start: 62, length: 2 },
    { value: { type: 'plus' }, start: 62, length: 1 },
    { value: { type: 'semicolon' }, start: 63, length: 1 },
    { value: { type: 'space' }, start: 64, length: 1 },
    { value: { type: 'word', value: 'SH' }, start: 67, length: 2 },
    { value: { type: 'space' }, start: 67, length: 1 },
    { value: { type: 'number', value: '10' }, start: 70, length: 2 },
    { value: { type: 'colon' }, start: 70, length: 1 },
    { value: { type: 'number', value: '00' }, start: 73, length: 2 },
    { value: { type: 'dash' }, start: 73, length: 1 },
    { value: { type: 'number', value: '14' }, start: 76, length: 2 },
    { value: { type: 'colon' }, start: 76, length: 1 },
    { value: { type: 'number', value: '00' }, start: 79, length: 2 },
    { value: { type: 'semicolon' }, start: 79, length: 1 },
    { value: { type: 'word', value: 'Jan' }, start: 83, length: 3 },
    { value: { type: 'space' }, start: 83, length: 1 },
    { value: { type: 'number', value: '12' }, start: 86, length: 2 },
    { value: { type: 'dash' }, start: 86, length: 1 },
    { value: { type: 'number', value: '14' }, start: 89, length: 2 },
    { value: { type: 'space' }, start: 89, length: 1 },
    { value: { type: 'number', value: '24' }, start: 92, length: 2 },
    { value: { type: 'slash' }, start: 92, length: 1 },
    { value: { type: 'number', value: '7' }, start: 94, length: 1 },
    { value: { type: 'semicolon' }, start: 94, length: 1 },
    { value: { type: 'space' }, start: 95, length: 1 },
    { value: { type: 'word', value: 'Aug' }, start: 99, length: 3 },
    { value: { type: 'space' }, start: 99, length: 1 },
    { value: { type: 'word', value: 'sunrise' }, start: 107, length: 7 },
    { value: { type: 'dash' }, start: 107, length: 1 },
    { value: { type: 'word', value: 'sunset' }, start: 114, length: 6 },
    { value: { type: 'semicolon' }, start: 114, length: 1 },
    { value: { type: 'space' }, start: 115, length: 1 },
    { value: { type: 'word', value: 'easter' }, start: 122, length: 6 },
    { value: { type: 'space' }, start: 122, length: 1 },
    { value: { type: 'dash' }, start: 123, length: 1 },
    { value: { type: 'number', value: '2' }, start: 125, length: 1 },
    { value: { type: 'space' }, start: 125, length: 1 },
    { value: { type: 'word', value: 'days' }, start: 130, length: 4 },
    { value: { type: 'space' }, start: 130, length: 1 },
    { value: { type: 'word', value: 'off' }, start: 134, length: 3 }
  ]

  assert.deepEqual(lex(input), expected)
})
