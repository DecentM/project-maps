type NumberToken = {
  type: 'number'
  value: string
}

type ColonToken = {
  type: 'colon'
}

type DashToken = {
  type: 'dash'
}

type WordToken = {
  type: 'word'
  value: string
}

type SemicolonToken = {
  type: 'semicolon'
}

type NewlineToken = {
  type: 'newline'
}

type SquareBracketToken = {
  type: 'squareBracket'
  value: 'open' | 'close'
}

type SlashToken = {
  type: 'slash'
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

  while (cursor < input.length) {
    const current = input[cursor]

    if (/\d/.test(current)) {
      result.push({
        type: 'number',
        value: consumeWhile((char) => /\d/.test(char)),
      })
      cursor++
      continue
    }

    if (/[a-zA-Z]/.test(current)) {
      result.push({
        type: 'word',
        value: consumeWhile((char) => /[a-zA-Z]/.test(char)),
      })
      cursor++
      continue
    }

    if (current === '-') {
      result.push({
        type: 'dash',
      })
      cursor++
      continue
    }

    if (current === ':') {
      result.push({
        type: 'colon',
      })
      cursor++
      continue
    }

    if (current === ';') {
      result.push({
        type: 'semicolon',
      })
      cursor++
      continue
    }

    if (current === '\n') {
      result.push({
        type: 'newline',
      })
      cursor++
      continue
    }

    if (current === '[') {
      result.push({
        type: 'squareBracket',
        value: 'open',
      })
      cursor++
      continue
    }

    if (current === ']') {
      result.push({
        type: 'squareBracket',
        value: 'close',
      })
      cursor++
      continue
    }

    if (current === '/') {
      result.push({
        type: 'slash',
      })
      cursor++
      continue
    }

    cursor++
  }

  return result
}
