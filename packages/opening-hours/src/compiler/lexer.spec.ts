import test from 'node:test'
import assert from 'node:assert'

import { lex } from './lexer.js'

test('lexer', () => {
  const input = 'Mon-Fri 12:00-23:30'

  const expected = [
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

  assert.deepEqual(lex(input), expected)
})

test('kitchensink', () => {
  const input =
    'Mo 08:00-16:00; Mo[-2] 08:00-12:00;\n Dec 12 off;[PH] 08:00-16:00; [SH] 10:00-14:00;Jan 12-14 24/7; Aug sunrise-sunset; easter -2 days off'

  const expected = [
    { type: 'word', value: 'Mo' },
    { type: 'number', value: '08' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'dash' },
    { type: 'number', value: '16' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'semicolon' },
    { type: 'word', value: 'Mo' },
    { type: 'squareBracket', value: 'open' },
    { type: 'dash' },
    { type: 'number', value: '2' },
    { type: 'squareBracket', value: 'close' },
    { type: 'number', value: '08' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'dash' },
    { type: 'number', value: '12' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'semicolon' },
    { type: 'newline' },
    { type: 'word', value: 'Dec' },
    { type: 'number', value: '12' },
    { type: 'word', value: 'off' },
    { type: 'semicolon' },
    { type: 'squareBracket', value: 'open' },
    { type: 'word', value: 'PH' },
    { type: 'squareBracket', value: 'close' },
    { type: 'number', value: '08' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'dash' },
    { type: 'number', value: '16' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'semicolon' },
    { type: 'squareBracket', value: 'open' },
    { type: 'word', value: 'SH' },
    { type: 'squareBracket', value: 'close' },
    { type: 'number', value: '10' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'dash' },
    { type: 'number', value: '14' },
    { type: 'colon' },
    { type: 'number', value: '00' },
    { type: 'semicolon' },
    { type: 'word', value: 'Jan' },
    { type: 'number', value: '12' },
    { type: 'dash' },
    { type: 'number', value: '14' },
    { type: 'number', value: '24' },
    { type: 'slash' },
    { type: 'number', value: '7' },
    { type: 'semicolon' },
    { type: 'word', value: 'Aug' },
    { type: 'word', value: 'sunrise' },
    { type: 'dash' },
    { type: 'word', value: 'sunset' },
    { type: 'semicolon' },
    { type: 'word', value: 'easter' },
    { type: 'dash' },
    { type: 'number', value: '2' },
    { type: 'word', value: 'days' },
    { type: 'word', value: 'off' },
  ]

  assert.deepEqual(lex(input), expected)
})
