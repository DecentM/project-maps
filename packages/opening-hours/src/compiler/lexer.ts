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

export const lex = (input: string): Token[] => {
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

  const result: Token[] = []

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
      case /\d/.test(current):
        result.push(parseNumber())
        break

      case /[a-zA-Z]/.test(current):
        result.push(parseWord())
        break

      case current === '-':
        result.push({ type: 'dash' })
        cursor++
        break

      case current === ':':
        result.push({ type: 'colon' })
        cursor++
        break

      case current === ';':
        result.push({ type: 'semicolon' })
        cursor++
        break

      case current === '\n':
        result.push({ type: 'newline' })
        cursor++
        break

      case current === '[':
        result.push(parseSquareBracket('['))
        break

      case current === ']':
        result.push(parseSquareBracket(']'))
        break

      case current === '/':
        result.push({ type: 'slash' })
        cursor++
        break

      case current === ' ':
        result.push({ type: 'space' })
        cursor++
        break

      case current === ',':
        result.push({ type: 'comma' })
        cursor++
        break

      default:
        cursor++
        break
    }
  }

  return result
}
