type Token = unknown

const defaultInput = 'Mon-Fri 12:00-23:30'

export const lex = (input: string): Token[] => {
  let cursor = 0

  const consumeWhile = (test: (char: string) => boolean) => {
    let temp = ''

    while (test(input[cursor])) {
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
      result.push(consumeWhile((char) => char !== ':' && /\d/.test(char)))
      cursor++
      continue
    }

    if (/[a-zA-Z]/.test(current)) {
      result.push(consumeWhile((char) => /[a-zA-Z]/.test(char)))
      cursor++
      continue
    }

    if (current === '-') {
      result.push('-')
      cursor++
      continue
    }

    if (current === ':') {
      result.push(':')
      cursor++
      continue
    }

    cursor++
  }

  return result
}

console.log(lex(defaultInput))
