import { LexingError } from './errors.js'

export type NumberToken = {
  type: 'number'
  value: string
}

export type ColonToken = {
  type: 'colon'
}

export type DashToken = {
  type: 'dash'
}

export type WordToken = {
  type: 'word'
  value: string
}

export type SemicolonToken = {
  type: 'semicolon'
}

export type NewlineToken = {
  type: 'newline'
}

export type SquareBracketToken = {
  type: 'squareBracket'
  value: 'open' | 'close'
}

export type SlashToken = {
  type: 'slash'
}

export type SpaceToken = {
  type: 'space'
}

export type CommaToken = {
  type: 'comma'
}

export type PlusToken = {
  type: 'plus'
}

export type Token =
  | NumberToken
  | ColonToken
  | DashToken
  | WordToken
  | SemicolonToken
  | NewlineToken
  | SquareBracketToken
  | SlashToken
  | SpaceToken
  | CommaToken
  | PlusToken

export type TokenSource = {
  start: number
  content: string
}

export type TokenEnvelope = TokenSource & {
  value: Token
}

export const lex = (input: string): TokenEnvelope[] => {
  let cursor = 0

  const consumeWhile = (test: (char: string) => boolean) => {
    let temp = ''

    while (test(input[cursor])) {
      if (cursor >= input.length) {
        break
      }

      temp += input[cursor]
      cursor++
    }

    cursor--

    return temp
  }

  const result: TokenEnvelope[] = []

  const parseNumber = (): NumberToken => {
    try {
      return {
        type: 'number',
        value: consumeWhile((char) => /\d/.test(char)),
      }
    } finally {
      cursor++
    }
  }

  const parseWord = (): WordToken => {
    try {
      return {
        type: 'word',
        value: consumeWhile((char) => /[a-zA-Z]/.test(char)),
      }
    } finally {
      cursor++
    }
  }

  const parseSquareBracket = (value: '[' | ']'): SquareBracketToken => {
    try {
      return {
        type: 'squareBracket',
        value: value === '[' ? 'open' : 'close',
      }
    } finally {
      cursor++
    }
  }

  while (cursor < input.length) {
    const current = input[cursor]

    switch (true) {
      case /\d/.test(current): {
        const token = parseNumber()

        result.push({
          value: token,
          start: cursor,
          content: token.value,
        })
        break
      }

      case /[a-zA-Z]/.test(current): {
        const token = parseWord()

        result.push({
          value: token,
          start: cursor,
          content: token.value,
        })
        break
      }

      case current === '-':
        result.push({
          value: { type: 'dash' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === ':':
        result.push({
          value: { type: 'colon' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === ';':
        result.push({
          value: { type: 'semicolon' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === '\n':
        result.push({
          value: { type: 'newline' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === '[':
        result.push({
          value: parseSquareBracket('['),
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        break

      case current === ']':
        result.push({
          value: parseSquareBracket(']'),
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        break

      case current === '/':
        result.push({
          value: { type: 'slash' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === ' ':
        result.push({
          value: { type: 'space' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === ',':
        result.push({
          value: { type: 'comma' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      case current === '+':
        result.push({
          value: { type: 'plus' },
          start: cursor,
          content: input.slice(cursor, cursor + 1),
        })
        cursor++
        break

      default:
        throw new LexingError(
          `Unexpected character: "${current}" at position ${cursor}`,
          undefined,
          {
            start: cursor,
            content: input.slice(cursor, cursor + 1),
          }
        )
    }
  }

  return result
}
