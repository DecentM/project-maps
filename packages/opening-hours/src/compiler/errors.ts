import VError, { Info } from 'verror'
import type { TokenSource } from './lexer.js'

type AcceptedError = Error | Info | string

const isAcceptedError = (error: unknown): error is AcceptedError => {
  return (
    error instanceof Error ||
    (typeof error === 'object' && error !== null && 'info' in error) ||
    typeof error === 'string'
  )
}

class CompilerError extends VError {
  constructor(cause: unknown, message: string = 'Compiler error', source?: TokenSource) {
    if (!isAcceptedError(cause)) {
      cause = new CompilerError(`Unknown cause: ${String(cause)}`, message)
    }

    if (source) {
      message += `: at ${source.start} -> "${source.content}"`
    }

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
  constructor(cause: unknown, message: string = 'Parsing error', source?: TokenSource) {
    super(cause, message, source)

    this.name = 'ParsingError'
  }
}

export class LexingError extends CompilerError {
  constructor(cause: unknown, message: string = 'Lexing error', source?: TokenSource) {
    super(cause, message, source)

    this.name = 'LexingError'
  }
}

export class TransformationError extends CompilerError {
  constructor(cause: unknown, message: string = 'Transformation error', source?: TokenSource) {
    super(cause, message, source)

    this.name = 'TransformationError'
  }
}
