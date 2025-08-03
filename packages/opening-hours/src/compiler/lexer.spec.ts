import assert from 'node:assert'
import test from 'node:test'

import { lex } from './lexer.js'

test('lexer', () => {
  const input = 'Mon-Fri 12:00-23:30'

  const expected = [
    { value: { type: 'word', value: 'Mon' }, start: 3, content: 'Mon' },
    { value: { type: 'dash' }, start: 3, content: '-' },
    { value: { type: 'word', value: 'Fri' }, start: 7, content: 'Fri' },
    { value: { type: 'space' }, start: 7, content: ' ' },
    { value: { type: 'number', value: '12' }, start: 10, content: '12' },
    { value: { type: 'colon' }, start: 10, content: ':' },
    { value: { type: 'number', value: '00' }, start: 13, content: '00' },
    { value: { type: 'dash' }, start: 13, content: '-' },
    { value: { type: 'number', value: '23' }, start: 16, content: '23' },
    { value: { type: 'colon' }, start: 16, content: ':' },
    { value: { type: 'number', value: '30' }, start: 19, content: '30' },
  ]

  assert.deepEqual(lex(input), expected)
})

test('kitchensink', () => {
  const input =
    'Mo 08:00-16:00; Mo[-2] 08:00-12:00;\n Dec 12 off;PH 08:00-16:00+; SH 10:00-14:00;Jan 12-14 24/7; Aug sunrise-sunset; easter -2 days off'

  const expected = [
    { value: { type: 'word', value: 'Mo' }, start: 2, content: 'Mo' },
    { value: { type: 'space' }, start: 2, content: ' ' },
    { value: { type: 'number', value: '08' }, start: 5, content: '08' },
    { value: { type: 'colon' }, start: 5, content: ':' },
    { value: { type: 'number', value: '00' }, start: 8, content: '00' },
    { value: { type: 'dash' }, start: 8, content: '-' },
    { value: { type: 'number', value: '16' }, start: 11, content: '16' },
    { value: { type: 'colon' }, start: 11, content: ':' },
    { value: { type: 'number', value: '00' }, start: 14, content: '00' },
    { value: { type: 'semicolon' }, start: 14, content: ';' },
    { value: { type: 'space' }, start: 15, content: ' ' },
    { value: { type: 'word', value: 'Mo' }, start: 18, content: 'Mo' },
    { value: { type: 'squareBracket', value: 'open' }, start: 19, content: '-' },
    { value: { type: 'dash' }, start: 19, content: '-' },
    { value: { type: 'number', value: '2' }, start: 21, content: '2' },
    { value: { type: 'squareBracket', value: 'close' }, start: 22, content: ' ' },
    { value: { type: 'space' }, start: 22, content: ' ' },
    { value: { type: 'number', value: '08' }, start: 25, content: '08' },
    { value: { type: 'colon' }, start: 25, content: ':' },
    { value: { type: 'number', value: '00' }, start: 28, content: '00' },
    { value: { type: 'dash' }, start: 28, content: '-' },
    { value: { type: 'number', value: '12' }, start: 31, content: '12' },
    { value: { type: 'colon' }, start: 31, content: ':' },
    { value: { type: 'number', value: '00' }, start: 34, content: '00' },
    { value: { type: 'semicolon' }, start: 34, content: ';' },
    { value: { type: 'newline' }, start: 35, content: '\n' },
    { value: { type: 'space' }, start: 36, content: ' ' },
    { value: { type: 'word', value: 'Dec' }, start: 40, content: 'Dec' },
    { value: { type: 'space' }, start: 40, content: ' ' },
    { value: { type: 'number', value: '12' }, start: 43, content: '12' },
    { value: { type: 'space' }, start: 43, content: ' ' },
    { value: { type: 'word', value: 'off' }, start: 47, content: 'off' },
    { value: { type: 'semicolon' }, start: 47, content: ';' },
    { value: { type: 'word', value: 'PH' }, start: 50, content: 'PH' },
    { value: { type: 'space' }, start: 50, content: ' ' },
    { value: { type: 'number', value: '08' }, start: 53, content: '08' },
    { value: { type: 'colon' }, start: 53, content: ':' },
    { value: { type: 'number', value: '00' }, start: 56, content: '00' },
    { value: { type: 'dash' }, start: 56, content: '-' },
    { value: { type: 'number', value: '16' }, start: 59, content: '16' },
    { value: { type: 'colon' }, start: 59, content: ':' },
    { value: { type: 'number', value: '00' }, start: 62, content: '00' },
    { value: { type: 'plus' }, start: 62, content: '+' },
    { value: { type: 'semicolon' }, start: 63, content: ';' },
    { value: { type: 'space' }, start: 64, content: ' ' },
    { value: { type: 'word', value: 'SH' }, start: 67, content: 'SH' },
    { value: { type: 'space' }, start: 67, content: ' ' },
    { value: { type: 'number', value: '10' }, start: 70, content: '10' },
    { value: { type: 'colon' }, start: 70, content: ':' },
    { value: { type: 'number', value: '00' }, start: 73, content: '00' },
    { value: { type: 'dash' }, start: 73, content: '-' },
    { value: { type: 'number', value: '14' }, start: 76, content: '14' },
    { value: { type: 'colon' }, start: 76, content: ':' },
    { value: { type: 'number', value: '00' }, start: 79, content: '00' },
    { value: { type: 'semicolon' }, start: 79, content: ';' },
    { value: { type: 'word', value: 'Jan' }, start: 83, content: 'Jan' },
    { value: { type: 'space' }, start: 83, content: ' ' },
    { value: { type: 'number', value: '12' }, start: 86, content: '12' },
    { value: { type: 'dash' }, start: 86, content: '-' },
    { value: { type: 'number', value: '14' }, start: 89, content: '14' },
    { value: { type: 'space' }, start: 89, content: ' ' },
    { value: { type: 'number', value: '24' }, start: 92, content: '24' },
    { value: { type: 'slash' }, start: 92, content: '/' },
    { value: { type: 'number', value: '7' }, start: 94, content: '7' },
    { value: { type: 'semicolon' }, start: 94, content: ';' },
    { value: { type: 'space' }, start: 95, content: ' ' },
    { value: { type: 'word', value: 'Aug' }, start: 99, content: 'Aug' },
    { value: { type: 'space' }, start: 99, content: ' ' },
    { value: { type: 'word', value: 'sunrise' }, start: 107, content: 'sunrise' },
    { value: { type: 'dash' }, start: 107, content: '-' },
    { value: { type: 'word', value: 'sunset' }, start: 114, content: 'sunset' },
    { value: { type: 'semicolon' }, start: 114, content: ';' },
    { value: { type: 'space' }, start: 115, content: ' ' },
    { value: { type: 'word', value: 'easter' }, start: 122, content: 'easter' },
    { value: { type: 'space' }, start: 122, content: ' ' },
    { value: { type: 'dash' }, start: 123, content: '-' },
    { value: { type: 'number', value: '2' }, start: 125, content: '2' },
    { value: { type: 'space' }, start: 125, content: ' ' },
    { value: { type: 'word', value: 'days' }, start: 130, content: 'days' },
    { value: { type: 'space' }, start: 130, content: ' ' },
    { value: { type: 'word', value: 'off' }, start: 134, content: 'off' },
  ]

  assert.deepEqual(lex(input), expected)
})
