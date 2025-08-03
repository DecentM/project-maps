import VError, { Info } from 'verror'

class CompilerError extends VError {
  constructor(cause: Error | Info | string, message: string = 'Compiler error') {
    switch (true) {
      case typeof cause === 'string':
        super(cause)
        break
      case cause instanceof Error:
        super(cause, message)
        break
      case typeof cause === 'object' && cause !== null:
        super({ info: cause }, message)
        break
      default:
        super('Compiler error with unknown cause')
        break
    }

    this.name = 'CompilerError'
  }
}

export class ParsingError extends CompilerError {
  constructor(cause: Error | Info | string, message: string = 'Parsing error') {
    super(cause, message)

    this.name = 'ParsingError'
  }
}

export class LexingError extends CompilerError {
  constructor(cause: Error | Info | string, message: string = 'Lexing error') {
    super(cause, message)

    this.name = 'LexingError'
  }
}
