import * as Lexer from './lexer.js'

import { Day, Hour, isDay, isHour, isMinute, isMonth, Minute, Month } from '../opening-hours.js'

export type Ast = {
  type: 'root'
  children: Node[]
}

type SingleDay = {
  type: 'singleDay'
  day: Day
}

type DayRange = {
  type: 'dayRange'
  start: Day
  end: Day
}

type TimeRange = {
  type: 'timeRange'
  start: {
    hour: number
    minute: number
  }
  end: {
    hour: number
    minute: number
  }
}

type SingleMonth = {
  type: 'singleMonth'
  month: Month
}

type MonthRange = {
  type: 'monthRange'
  start: Month
  end: Month
}

type TwentyFourSeven = {
  type: 'twentyFourSeven'
}

type Off = {
  type: 'off'
}

export type Node = DayRange | TimeRange | TwentyFourSeven | SingleDay | SingleMonth | MonthRange | Off

// //////////////////////////////////////
// WIP Node
// //////////////////////////////////////

class WipNode {
  public create(): Node | null {
    if (this.dayStart && this.dayEnd) {
      return {
        type: 'dayRange',
        start: this.dayStart,
        end: this.dayEnd,
      } as DayRange
    }

    if (this.dayStart) {
      return {
        type: 'singleDay',
        day: this.dayStart,
      } as SingleDay
    }

    if (this.monthStart && this.monthEnd) {
      return {
        type: 'monthRange',
        start: this.monthStart,
        end: this.monthEnd,
      } as MonthRange
    }

    if (this.monthStart) {
      return {
        type: 'singleMonth',
        month: this.monthStart,
      } as SingleMonth
    }

    if (this.timeStartHour !== null && this.timeStartMinute !== null && this.timeEndHour !== null && this.timeEndMinute !== null) {
      return {
        type: 'timeRange',
        start: {
          hour: this.timeStartHour,
          minute: this.timeStartMinute,
        },
        end: {
          hour: this.timeEndHour,
          minute: this.timeEndMinute,
        },
      } as TimeRange
    }

    if (this.twentyFourSeven) {
      return {
        type: 'twentyFourSeven',
      } as TwentyFourSeven
    }

    if (this.off) {
      return {
        type: 'off',
      } as Off
    }

    throw new Error('[PARSING ERROR] WIP Node is incomplete, cannot create node')
  }

  private dayStart: Day | null = null

  public setDayStart(day: Day) {
    this.dayStart = day
  }

  private dayEnd: Day | null = null

  public setDayEnd(day: Day) {
    this.dayEnd = day
  }

  private monthStart: Month | null = null

  public setMonthStart(month: Month) {
    this.monthStart = month
  }

  private monthEnd: Month | null = null

  public setMonthEnd(month: Month) {
    this.monthEnd = month
  }

  private timeStartHour: Hour | null = null

  public setTimeStartHour(hour: Hour) {
    this.timeStartHour = hour
  }

  private timeStartMinute: Minute | null = null

  public setTimeStartMinute(minute: Minute) {
    this.timeStartMinute = minute
  }

  private timeEndHour: Hour | null = null

  public setTimeEndHour(hour: string) {
    const number = Number.parseInt(hour, 10)

    if (!isHour(number)) {
      return
    }

    this.timeEndHour = number
  }

  private timeEndMinute: Minute | null = null

  public setTimeEndMinute(minute: string) {
    const number = Number.parseInt(minute, 10)

    if (!isMinute(number)) {
      return
    }

    this.timeEndMinute = number
  }

  private twentyFourSeven: boolean | null = null

  public setTwentyFourSeven() {
    this.twentyFourSeven = true
  }

  private off: boolean | null = null

  public setOff() {
    this.off = true
  }
}

// //////////////////////////////////////
// Types
// //////////////////////////////////////

enum ParsingState {
  Empty = 'empty',
  DayFirst = 'dayFirst',
  DayLast = 'dayLast',
  TimeFirstHour = 'timeFirstHour',
  TimeFirstMinute = 'timeFirstMinute',
  TimeLastHour = 'timeLastHour',
  TimeLastMinute = 'timeLastMinute',
  TwentyFourSeven = 'twentyFourSeven',
  MonthFirst = 'monthFirst',
  MonthLast = 'monthLast',
  Off = 'off',
}

type ParsingStateFunction = () => ParsingState

// //////////////////////////////////////
// Parser
// //////////////////////////////////////

export const parse = (input: Lexer.TokenEnvelope[]): Ast => {
  // //////////////////////////////////////
  // State
  // //////////////////////////////////////

  let _cursor = 0

  const cursor = {
    get value () {
      return _cursor
    },
    set value (value: number) {
      debug(`Cursor change! ${_cursor} -> ${value}`)

      if (value < 0 || value >= input.length) {
        throw new Error(`[PARSING ERROR] Cursor out of bounds: ${value} (length: ${input.length})`)
      }

      _cursor = value
    }
  }

  let _state: ParsingState = ParsingState.Empty

  const state = {
    get value () {
      return _state
    },
    set value (value: ParsingState) {
      debug('State change!', _state, '->', value)
      const oldState = _state
      _state = value
      onStateChange(value, oldState)
    }
  }

  // //////////////////////////////////////
  // Utils
  // //////////////////////////////////////

  const debug = (...messages: Array<string | undefined | number>) => {
    console.log(`${messages.join(' ')} (cursor: ${cursor.value}, state: ${state.value})`)
  }

  const result: Ast = {
    type: 'root',
    children: []
  }

  let wipNode = new WipNode()

  const finaliseWipNode = () => {
    const node = wipNode.create()

    debug('Finalising WIP Node', JSON.stringify(node, null, 2))

    if (node) {
      result.children.push(node)
    }

    wipNode = new WipNode()
  }

  const peekCurrentToken = () => {
    if (cursor.value >= input.length) {
      throw new Error('[PARSING ERROR] Unexpected end of input while parsing current token')
    }

    return input[cursor.value].value
  }

  const peekNextToken = () => {
    if (cursor.value >= input.length) {
      return null
    }

    return input[cursor.value + 1].value ?? null
  }

  const peekPreviousToken = () => {
    if (cursor.value <= 0) {
      return null
    }

    return input[cursor.value - 1].value ?? null
  }

  // //////////////////////////////////////
  // Parsing
  // //////////////////////////////////////

  const onDayFirst = (current: Lexer.Token) => {
    if (current.type !== 'word') {
      throw new Error(`[PARSING ERROR] onDayFirst: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    const day = current.value.substring(0, 2)

    if (!isDay(day)) {
      throw new Error(`[PARSING ERROR] onDayFirst: Expected a day, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setDayStart(day)
  }

  const onDayLast = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
    }

    if (current.type !== 'word') {
      throw new Error(`[PARSING ERROR] onDayLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    const day = current.value.substring(0, 2)

    if (!isDay(day)) {
      throw new Error(`[PARSING ERROR] onDayLast: Expected a day, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setDayEnd(day)
  }

  const onTimeFirstHour = (current: Lexer.Token) => {
    if (current.type !== 'number') {
      throw new Error(`[PARSING ERROR] onTimeFirst: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const hour = Number.parseInt(current.value, 10)

    if (!isHour(hour)) {
      throw new Error(`[PARSING ERROR] onTimeFirst: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`)
    }

    debug('Setting time start hour', hour)
    wipNode.setTimeStartHour(hour)
  }

  const onTimeFirstMinute = (current: Lexer.Token) => {
    if (current.type === 'colon') {
      return
    }

    if (current.type !== 'number') {
      throw new Error(`[PARSING ERROR] onTimeFirstMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new Error(`[PARSING ERROR] onTimeFirstMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`)
    }

    debug('Setting time start minute', minute)
    wipNode.setTimeStartMinute(minute)
  }

  const onTimeLastHour = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
    }

    if (current.type !== 'number') {
      throw new Error(`[PARSING ERROR] onTimeLastHour: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const hour = Number.parseInt(current.value, 10)

    if (!isHour(hour)) {
      throw new Error(`[PARSING ERROR] onTimeLastHour: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setTimeEndHour(current.value)
  }

  const onTimeLastMinute = (current: Lexer.Token) => {
    if (current.type === 'colon') {
      return
    }

    if (current.type !== 'number') {
      throw new Error(`[PARSING ERROR] onTimeLastMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new Error(`[PARSING ERROR] onTimeLastMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setTimeEndMinute(current.value)
  }

  const onTwentyFourSeven = (current: Lexer.Token) => {
    const next = peekNextToken()
    cursor.value++
    const nextNext = peekNextToken()
    cursor.value--

    if (current.type !== 'number' || current.value !== '24' || next?.type !== 'slash' || nextNext?.type !== 'number' || nextNext.value !== '7') {
      throw new Error(`[PARSING ERROR] onTwentyFourSeven: Expected '24/7', got ${JSON.stringify(current)} - ${JSON.stringify(next)} - ${JSON.stringify(nextNext)}`)
    }

    wipNode.setTwentyFourSeven()
  }

  const onMonthFirst = (current: Lexer.Token) => {
    if (current.type !== 'word') {
      throw new Error(`[PARSING ERROR] onMonthFirst: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (!isMonth(current.value)) {
      throw new Error(`[PARSING ERROR] onMonthFirst: Expected a month, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setMonthStart(current.value)
  }

  const onMonthLast = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
      return
    }

    if (current.type !== 'word') {
      throw new Error(`[PARSING ERROR] onMonthLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (!isMonth(current.value)) {
      throw new Error(`[PARSING ERROR] onMonthLast: Expected a month, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setMonthEnd(current.value)
  }

  const onOff = (current: Lexer.Token) => {
    if (current.type !== 'word' || current.value !== 'off') {
      throw new Error(`[PARSING ERROR] onOff: Expected 'off', got ${JSON.stringify(current)}`)
    }

    wipNode.setOff()
  }

  const onEmpty = (current: Lexer.Token, oldState: ParsingState) => {
    if (oldState === ParsingState.Empty) {
      return
    }

    finaliseWipNode()
    state.value = getNewState(current)
  }

  const onStateChange = (newState: ParsingState, oldState: ParsingState) => {
    const current = peekCurrentToken()

    switch (newState) {
      case ParsingState.DayFirst:
        onDayFirst(current)
        break
      case ParsingState.DayLast:
        onDayLast(current)
        break
      case ParsingState.TimeFirstHour:
        onTimeFirstHour(current)
        break;
      case ParsingState.TimeFirstMinute:
        onTimeFirstMinute(current)
        break;
      case ParsingState.TimeLastHour:
        onTimeLastHour(current)
        break;
      case ParsingState.TimeLastMinute:
        onTimeLastMinute(current)
        break;
      case ParsingState.TwentyFourSeven:
        onTwentyFourSeven(current)
        break;
      case ParsingState.MonthFirst:
        onMonthFirst(current)
        break;
      case ParsingState.MonthLast:
        onMonthLast(current)
        break;
      case ParsingState.Off:
        onOff(current)
        break;
      case ParsingState.Empty:
        onEmpty(current, oldState)
        break;
      default:
        throw new Error(`[PARSING ERROR] onStateChange: Unhandled state: ${newState}`)
    }
  }

  // //////////////////////////////////////
  // State transitions
  // //////////////////////////////////////

  const empty_number: ParsingStateFunction = () => {
    const next = peekNextToken()
    const current = peekCurrentToken()

    if (!next) {
      throw new Error('[PARSING ERROR] Unexpected end of input while parsing number')
    }

    if (current.type !== 'number') {
      throw new Error(`[PARSING ERROR] Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    switch (next.type) {
      case 'colon':
        return ParsingState.TimeFirstHour
      case 'space':
        return ParsingState.DayFirst
      case 'slash': {
        if (current.value === '24') {
          return ParsingState.TwentyFourSeven
        }

        throw new Error(`[PARSING ERROR] Unexpected token after number and slash: ${next.type} (${JSON.stringify(next)})`)
      }
      default:
        throw new Error(`[PARSING ERROR] Unexpected token after number: ${next.type} (${JSON.stringify(next)})`)
    }
  }

  const empty_word: ParsingStateFunction = () => {
    const current = peekCurrentToken()

    if (!current) {
      debug('[PARSING ERROR]')
      throw new Error('[PARSING ERROR] Unexpected end of input while parsing word')
    }

    if (current.type !== 'word') {
      debug('[PARSING ERROR]')
      throw new Error(`[PARSING ERROR] Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (isDay(current.value.substring(0, 2))) {
      return ParsingState.DayFirst
    }

    if (isMonth(current.value)) {
      return ParsingState.MonthFirst
    }

    if (current.value === 'off') {
      return ParsingState.Off
    }

    throw new Error(`[PARSING ERROR] Unexpected word: ${current.value} (${JSON.stringify(current)})`)
  }

  // //////////////////////////////////////
  // State Machine
  // //////////////////////////////////////

  const parsingStateMachine: Record<ParsingState, Partial<Record<Lexer.Token['type'] | '*', ParsingStateFunction>>> = {
    [ParsingState.Empty]: {
      number: empty_number,
      word: empty_word,
      '*': () => ParsingState.Empty,
    },
    [ParsingState.DayFirst]: {
      space: () => ParsingState.Empty,
      dash: () => ParsingState.DayLast,
      comma: () => ParsingState.DayFirst,
      '*': () => ParsingState.Empty,
    },
    [ParsingState.DayLast]: {
      '*': () => ParsingState.Empty,
    },
    [ParsingState.TimeFirstHour]: {
      colon: () => ParsingState.TimeFirstMinute,
    },
    [ParsingState.TimeLastHour]: {
      colon: () => ParsingState.TimeLastMinute,
      number: () => ParsingState.TimeLastHour,
    },
    [ParsingState.TimeFirstMinute]: {
      number: () => ParsingState.TimeFirstMinute,
      dash: () => ParsingState.TimeLastHour,
    },
    [ParsingState.TimeLastMinute]: {
      number: () => ParsingState.TimeLastMinute,
      semicolon: () => ParsingState.Empty,
    },
    [ParsingState.TwentyFourSeven]: {
      '*': () => ParsingState.Empty,
    },
    [ParsingState.MonthFirst]: {
      space: () => ParsingState.Empty,
      dash: () => ParsingState.MonthLast,
      comma: () => ParsingState.MonthFirst,
      '*': () => ParsingState.Empty,
    },
    [ParsingState.MonthLast]: {
      '*': () => ParsingState.Empty,
    },
    [ParsingState.Off]: {
      '*': () => ParsingState.Empty,
    },
  }

  const getNewState = (token: Lexer.Token): ParsingState => {
    const stateFunction = parsingStateMachine[state.value][token.type] ?? parsingStateMachine[state.value]['*']

    if (!stateFunction) {
      throw new Error(`[PARSING ERROR] No state function found for state ${state.value} and token type ${token.type}`)
    }

    debug('State resolution!', token.type, '->', stateFunction.name)

    return stateFunction()
  }

  while (cursor.value < input.length) {
    const newState = getNewState(peekCurrentToken())

    state.value = newState

    if (cursor.value >= input.length - 1) {
      break
    }

    cursor.value++
  }

  finaliseWipNode()

  return result
}

const input = 'Fr 08:30-20:00'
const tokens = Lexer.lex(input)
const ast = parse(tokens)

console.log('\n===========================\n')
console.log(tokens)
console.log('\n===========================\n')
console.log(JSON.stringify(ast, null, 2))
