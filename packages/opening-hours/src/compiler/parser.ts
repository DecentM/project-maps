import * as Lexer from './lexer.js'

import {
  Day,
  DayOfMonth,
  Hour,
  Minute,
  Month,
  isDay,
  isDayOfMonth,
  isHour,
  isMinute,
  isMonth,
} from '../opening-hours.js'

import { ParsingError } from './errors.js'

export type Ast = {
  type: 'root'
  children: Node[]
}

export type SingleDay = {
  type: 'singleDay'
  day: Day | DayOfMonth
}

export type DayRange = {
  type: 'dayRange'
  start: Day | DayOfMonth
  end: Day | DayOfMonth
}

export type CustomTime = 'sunrise' | 'sunset'

export const isCustomTime = (input: unknown): input is CustomTime => {
  return input === 'sunrise' || input === 'sunset'
}

export type CustomFest = 'easter'

export const isCustomFest = (input: unknown): input is CustomFest => {
  return input === 'easter'
}

export const OffsetUnit = [
  'second',
  'seconds',
  'minute',
  'minutes',
  'hour',
  'hours',
  'day',
  'days',
  'week',
  'weeks',
  'month',
  'months',
  'year',
  'years',
] as const

export type OffsetUnit = (typeof OffsetUnit)[number]

export const isOffsetUnit = (input: unknown): input is OffsetUnit => {
  return OffsetUnit.includes(input as OffsetUnit)
}

export type TimeRange = {
  type: 'timeRange'
  start:
    | CustomTime
    | {
        hour: number
        minute: number
      }
  end?:
    | CustomTime
    | {
        hour: number
        minute: number
        isNextDay?: boolean
        isAmbiguous?: boolean
      }
}

export type SingleMonth = {
  type: 'singleMonth'
  month: Month
}

export type MonthRange = {
  type: 'monthRange'
  start: Month
  end: Month
}

export type TwentyFourSeven = {
  type: 'twentyFourSeven'
}

export type Off = {
  type: 'off'
}

export type Fest = {
  type: 'fest'
  value: CustomFest
}

export type Offset = {
  type: 'offset'
  value: number
  unit?: OffsetUnit
}

export type Node =
  | DayRange
  | TimeRange
  | TwentyFourSeven
  | SingleDay
  | SingleMonth
  | MonthRange
  | Off
  | Fest
  | Offset

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
      }
    }

    if (this.dayStart) {
      return {
        type: 'singleDay',
        day: this.dayStart,
      }
    }

    if (this.monthStart && this.monthEnd) {
      return {
        type: 'monthRange',
        start: this.monthStart,
        end: this.monthEnd,
      }
    }

    if (this.monthStart) {
      return {
        type: 'singleMonth',
        month: this.monthStart,
      }
    }

    if (this.timeStartCustom && this.timeEndCustom) {
      return {
        type: 'timeRange',
        start: this.timeStartCustom,
        end: this.timeEndCustom,
      }
    }

    if (
      this.timeStartHour !== undefined &&
      this.timeStartMinute !== undefined &&
      this.timeEndHour !== undefined &&
      this.timeEndMinute !== undefined
    ) {
      return {
        type: 'timeRange',
        start: {
          hour: this.timeStartHour,
          minute: this.timeStartMinute,
        },
        end: {
          hour: this.timeEndHour,
          minute: this.timeEndMinute,
          isNextDay: this.timeEndIsNextDay ?? false,
          isAmbiguous: this.endAmbiguous ?? false,
        },
      }
    }

    if (this.twentyFourSeven) {
      return {
        type: 'twentyFourSeven',
      }
    }

    if (this.off) {
      return {
        type: 'off',
      }
    }

    if (this.fest) {
      return {
        type: 'fest',
        value: this.fest,
      }
    }

    if (this.offsetNumber !== undefined) {
      return {
        type: 'offset',
        value: this.offsetNegative ? -this.offsetNumber : this.offsetNumber,
        unit: this.offsetUnit ?? undefined,
      }
    }

    throw new ParsingError(
      'WIP Node is incomplete, cannot finalise',
      JSON.stringify(this, undefined, 2)
    )
  }

  private offsetNumber?: number

  public setOffsetNumber(value: number) {
    this.offsetNumber = value
  }

  private offsetNegative?: boolean

  public setOffsetNegative() {
    this.offsetNegative = true
  }

  private offsetUnit?: OffsetUnit

  public setOffsetUnit(value: OffsetUnit) {
    this.offsetUnit = value
  }

  private dayStart?: Day | DayOfMonth

  public setDayStart(day: Day | DayOfMonth) {
    this.dayStart = day
  }

  private dayEnd?: Day | DayOfMonth

  public setDayEnd(day: Day | DayOfMonth) {
    this.dayEnd = day
  }

  private monthStart?: Month

  public setMonthStart(month: Month) {
    this.monthStart = month
  }

  private monthEnd?: Month

  public setMonthEnd(month: Month) {
    this.monthEnd = month
  }

  private timeStartHour?: Hour

  public setTimeStartHour(hour: Hour) {
    this.timeStartHour = hour
  }

  private timeStartMinute?: Minute

  public setTimeStartMinute(minute: Minute) {
    this.timeStartMinute = minute
  }

  private timeStartCustom?: CustomTime

  public setTimeStartCustom(value: CustomTime) {
    this.timeStartCustom = value
  }

  private timeEndCustom?: CustomTime

  public setTimeEndCustom(value: CustomTime) {
    this.timeEndCustom = value
  }

  private timeEndHour?: Hour

  public setTimeEndHour(hour: Hour) {
    this.timeEndHour = hour
  }

  private timeEndIsNextDay?: boolean

  public setTimeEndIsNextDay() {
    this.timeEndIsNextDay = true
  }

  private timeEndMinute?: Minute

  public setTimeEndMinute(minute: Minute) {
    this.timeEndMinute = minute
  }

  private endAmbiguous?: boolean

  public setEndAmbiguous() {
    this.endAmbiguous = true
  }

  private twentyFourSeven?: boolean

  public setTwentyFourSeven() {
    this.twentyFourSeven = true
  }

  private off?: boolean

  public setOff() {
    this.off = true
  }

  private fest?: CustomFest

  public setFest(value: CustomFest) {
    this.fest = value
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
  Fest = 'fest',
  Offset = 'offset',
  Off = 'off',
}

type ParsingStateFunction = () => ParsingState

// //////////////////////////////////////
// Parser
// //////////////////////////////////////

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debug = (...messages: Array<string | undefined | number>) => {
  // console.log(`${messages.join(' ')} (cursor: ${cursor.value}, state: ${state.value})`)
}

export const parse = (input: Lexer.TokenEnvelope[]): Ast => {
  // //////////////////////////////////////
  // State
  // //////////////////////////////////////

  let _cursor = 0

  const cursor = {
    get value() {
      return _cursor
    },
    set value(value: number) {
      debug(`Cursor change! ${_cursor} -> ${value}`)

      if (value < 0 || value >= input.length) {
        throw new ParsingError(`Cursor out of bounds: ${value} (length: ${input.length})`)
      }

      _cursor = value
    },
  }

  let _state: ParsingState = ParsingState.Empty

  const state = {
    get value() {
      return _state
    },
    set value(value: ParsingState) {
      debug('State change!', _state, '->', value)
      const oldState = _state
      _state = value
      onStateChange(value, oldState)
    },
  }

  // //////////////////////////////////////
  // Utils
  // //////////////////////////////////////

  const result: Ast = {
    type: 'root',
    children: [],
  }

  let wipNode = new WipNode()

  const finaliseWipNode = () => {
    const node = wipNode.create()

    debug('Finalising WIP Node', JSON.stringify(node, undefined, 2))

    if (node) {
      result.children.push(node)
    }

    wipNode = new WipNode()
  }

  const peekCurrentToken = () => {
    if (cursor.value >= input.length) {
      throw new ParsingError('Unexpected end of input while parsing current token')
    }

    return input[cursor.value].value
  }

  const peekNextToken = () => {
    if (cursor.value >= input.length) {
      return
    }

    return input[cursor.value + 1].value
  }

  // //////////////////////////////////////
  // Parsing
  // //////////////////////////////////////

  const onDayFirst = (current: Lexer.Token) => {
    if (current.type === 'dash' || current.type === 'comma') {
      return
    }

    let day: Day | DayOfMonth | undefined

    if (current.type === 'number') {
      const dayOfMonth = Number.parseInt(current.value, 10)

      if (!isDayOfMonth(dayOfMonth)) {
        return
      }

      day = dayOfMonth
    }

    if (current.type === 'word') {
      const dayString = current.value.slice(0, 2)

      if (!isDay(dayString)) {
        throw new ParsingError(
          `onDayFirst: Expected a day, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      day = dayString
    }

    if (!day) {
      throw new ParsingError(
        `onDayFirst: Expected a word or number, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    wipNode.setDayStart(day)
  }

  const onDayLast = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
    }

    let day: Day | DayOfMonth | undefined

    if (current.type === 'number') {
      const dayOfMonth = Number.parseInt(current.value, 10)

      if (!isDayOfMonth(dayOfMonth)) {
        throw new ParsingError(
          `onDayLast: Expected a valid day of month, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      day = dayOfMonth
    }

    if (current.type === 'word') {
      const dayString = current.value.slice(0, 2)

      if (!isDay(dayString)) {
        throw new ParsingError(
          `onDayLast: Expected a day, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      day = dayString
    }

    if (!day) {
      throw new ParsingError(
        `onDayLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    wipNode.setDayEnd(day)
  }

  const onTimeFirstHour = (current: Lexer.Token) => {
    if (current.type === 'word') {
      if (!isCustomTime(current.value)) {
        throw new ParsingError(
          `onTimeFirstHour: Expected a custom time, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      wipNode.setTimeStartCustom(current.value)
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(
        `onTimeFirstHour: Expected a number, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    const hour = Number.parseInt(current.value, 10)

    if (!isHour(hour)) {
      throw new ParsingError(
        `onTimeFirstHour: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`
      )
    }

    debug('Setting time start hour', hour)
    wipNode.setTimeStartHour(hour)
  }

  const onTimeFirstMinute = (current: Lexer.Token) => {
    if (current.type === 'colon') {
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(
        `onTimeFirstMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new ParsingError(
        `onTimeFirstMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`
      )
    }

    debug('Setting time start minute', minute)
    wipNode.setTimeStartMinute(minute)
  }

  const onTimeLastHour = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
    }

    if (current.type === 'word') {
      if (!isCustomTime(current.value)) {
        throw new ParsingError(
          `onTimeFirstHour: Expected a custom time, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      wipNode.setTimeEndCustom(current.value)
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(
        `onTimeLastHour: Expected a number, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    let hour = Number.parseInt(current.value, 10)

    if (hour >= 24) {
      wipNode.setTimeEndIsNextDay()
      hour = hour % 24
    }

    if (!isHour(hour)) {
      throw new ParsingError(
        `onTimeLastHour: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`
      )
    }

    wipNode.setTimeEndHour(hour)
  }

  const onTimeLastMinute = (current: Lexer.Token) => {
    if (current.type === 'plus') {
      wipNode.setEndAmbiguous()
      return
    }

    if (current.type === 'colon') {
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(
        `onTimeLastMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new ParsingError(
        `onTimeLastMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`
      )
    }

    wipNode.setTimeEndMinute(minute)
  }

  const onTwentyFourSeven = (current: Lexer.Token) => {
    if (current.type !== 'number' && current.type !== 'slash') {
      throw new ParsingError(
        `onTwentyFourSeven: Expected a number or slash, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    if (current.type === 'number' && current.value !== '24' && current.value !== '7') {
      throw new ParsingError(
        `onTwentyFourSeven: Expected '24', got ${current.value} (${JSON.stringify(current)})`
      )
    }

    wipNode.setTwentyFourSeven()
  }

  const onMonthFirst = (current: Lexer.Token) => {
    if (current.type !== 'word') {
      throw new ParsingError(
        `onMonthFirst: Expected a word, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    if (!isMonth(current.value)) {
      throw new ParsingError(
        `onMonthFirst: Expected a month, got ${current.value} (${JSON.stringify(current)})`
      )
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
      throw new ParsingError(
        `onMonthLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    if (!isMonth(current.value)) {
      throw new ParsingError(
        `onMonthLast: Expected a month, got ${current.value} (${JSON.stringify(current)})`
      )
    }

    wipNode.setMonthEnd(current.value)
  }

  const onOff = (current: Lexer.Token) => {
    if (current.type !== 'word' || current.value !== 'off') {
      throw new ParsingError(`onOff: Expected 'off', got ${JSON.stringify(current)}`)
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

  const onFest = (current: Lexer.Token) => {
    if (current.type === 'space') {
      return
    }

    if (current.type !== 'word') {
      throw new ParsingError(
        `onFest: Expected a word, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    if (isCustomFest(current.value)) {
      wipNode.setFest(current.value)
      return
    }

    if (isOffsetUnit(current.value)) {
      return
    }

    throw new ParsingError(
      `onFest: Expected a custom fest, got ${current.value} (${JSON.stringify(current)})`
    )
  }

  const onOffset = (current: Lexer.Token) => {
    if (current.type === 'squareBracket' || current.type === 'space') {
      return
    }

    if (current.type === 'dash') {
      wipNode.setOffsetNegative()
      return
    }

    if (current.type !== 'number' && current.type !== 'word') {
      throw new ParsingError(
        `onOffset: Expected a number or word, got ${current.type} (${JSON.stringify(current)})`
      )
    }

    if (current.type === 'number') {
      const value = Number.parseInt(current.value, 10)

      if (Number.isNaN(value)) {
        throw new ParsingError(
          `onOffset: Expected a valid number, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      wipNode.setOffsetNumber(value)
      return
    }

    if (current.type === 'word') {
      if (!isOffsetUnit(current.value)) {
        throw new ParsingError(
          `onOffset: Expected a valid offset unit, got ${current.value} (${JSON.stringify(current)})`
        )
      }

      wipNode.setOffsetUnit(current.value)
      return
    }
  }

  const onStateChange = (newState: ParsingState, oldState: ParsingState) => {
    try {
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
          break
        case ParsingState.TimeFirstMinute:
          onTimeFirstMinute(current)
          break
        case ParsingState.TimeLastHour:
          onTimeLastHour(current)
          break
        case ParsingState.TimeLastMinute:
          onTimeLastMinute(current)
          break
        case ParsingState.TwentyFourSeven:
          onTwentyFourSeven(current)
          break
        case ParsingState.MonthFirst:
          onMonthFirst(current)
          break
        case ParsingState.MonthLast:
          onMonthLast(current)
          break
        case ParsingState.Off:
          onOff(current)
          break
        case ParsingState.Empty:
          onEmpty(current, oldState)
          break
        case ParsingState.Fest:
          onFest(current)
          break
        case ParsingState.Offset:
          onOffset(current)
          break
        default:
          throw new ParsingError(`Unhandled state: ${newState}`)
      }
    } catch (error) {
      throw new ParsingError(error, 'onStateChange')
    }
  }

  // //////////////////////////////////////
  // State transitions
  // //////////////////////////////////////

  const empty_number: ParsingStateFunction = () => {
    try {
      const next = peekNextToken()
      const current = peekCurrentToken()

      if (!next) {
        throw new ParsingError('Unexpected end of input while parsing number')
      }

      if (current.type !== 'number') {
        throw new ParsingError(
          `Expected a number, got ${current.type} (${JSON.stringify(current)})`
        )
      }

      switch (next.type) {
        case 'colon':
          return ParsingState.TimeFirstHour
        case 'space':
          return ParsingState.DayFirst
        case 'dash':
          return ParsingState.DayFirst
        case 'slash': {
          if (current.value === '24') {
            return ParsingState.TwentyFourSeven
          }

          throw new ParsingError(
            `Unexpected token after number and slash: ${next.type} (${JSON.stringify(next)})`
          )
        }
        default:
          throw new ParsingError(
            `Unexpected token after number: ${next.type} (${JSON.stringify(next)})`
          )
      }
    } catch (error) {
      throw new ParsingError(error, 'empty_number')
    }
  }

  const empty_word: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()

      if (!current) {
        throw new ParsingError('Unexpected end of input while parsing word')
      }

      if (current.type !== 'word') {
        throw new ParsingError(`Expected a word, got ${current.type} (${JSON.stringify(current)})`)
      }

      if (isDay(current.value.slice(0, 2))) {
        return ParsingState.DayFirst
      }

      if (isMonth(current.value)) {
        return ParsingState.MonthFirst
      }

      if (current.value === 'off') {
        return ParsingState.Off
      }

      if (isCustomTime(current.value)) {
        return ParsingState.TimeFirstHour
      }

      if (isCustomFest(current.value) || isOffsetUnit(current.value)) {
        return ParsingState.Fest
      }

      throw new ParsingError(`Unexpected word: ${current.value}`)
    } catch (error) {
      throw new ParsingError(error, 'empty_word')
    }
  }

  const dayfirst_squarebracket: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()

      if (current.type !== 'squareBracket') {
        throw new ParsingError(
          `Expected a square bracket, got ${current.type} (${JSON.stringify(current)})`
        )
      }

      if (current.value === 'close') {
        throw new ParsingError('Unexpected closing square bracket in or after day range')
      }

      return ParsingState.Offset
    } catch (error) {
      throw new ParsingError(error, 'dayfirst_squarebracket')
    }
  }

  const fest_word: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()

      if (current.type !== 'word') {
        throw new ParsingError(`Expected a word, got ${current.type} (${JSON.stringify(current)})`)
      }

      if (isCustomFest(current.value)) {
        return ParsingState.Fest
      }

      return ParsingState.Empty
    } catch (error) {
      throw new ParsingError(error, 'fest_word')
    }
  }

  const offset_space: ParsingStateFunction = () => {
    try {
      const next = peekNextToken()

      if (next?.type === 'word' && isOffsetUnit(next.value)) {
        return ParsingState.Offset
      }

      return ParsingState.Empty
    } catch (error) {
      throw new ParsingError(error, 'offset_space')
    }
  }

  // //////////////////////////////////////
  // State Machine
  // //////////////////////////////////////

  const parsingStateMachine: Record<
    ParsingState,
    Partial<Record<Lexer.Token['type'], ParsingStateFunction>>
  > = {
    [ParsingState.Empty]: {
      number: empty_number,
      word: empty_word,
      space: () => ParsingState.Empty,
      semicolon: () => ParsingState.Empty,
      squareBracket: () => ParsingState.Empty,
      newline: () => ParsingState.Empty,
      dash: () => ParsingState.Offset,
      comma: () => ParsingState.Empty,
    },
    [ParsingState.DayFirst]: {
      number: () => ParsingState.DayFirst,
      space: () => ParsingState.Empty,
      dash: () => ParsingState.DayLast,
      squareBracket: dayfirst_squarebracket,
      comma: () => ParsingState.Empty,
    },
    [ParsingState.DayLast]: {
      space: () => ParsingState.Empty,
    },
    [ParsingState.TimeFirstHour]: {
      colon: () => ParsingState.TimeFirstMinute,
      dash: () => ParsingState.TimeLastHour,
    },
    [ParsingState.TimeLastHour]: {
      colon: () => ParsingState.TimeLastMinute,
      number: () => ParsingState.TimeLastHour,
      semicolon: () => ParsingState.Empty,
    },
    [ParsingState.TimeFirstMinute]: {
      number: () => ParsingState.TimeFirstMinute,
      dash: () => ParsingState.TimeLastHour,
    },
    [ParsingState.TimeLastMinute]: {
      number: () => ParsingState.TimeLastMinute,
      semicolon: () => ParsingState.Empty,
      plus: () => ParsingState.TimeLastMinute,
    },
    [ParsingState.Offset]: {
      space: offset_space,
      dash: () => ParsingState.Offset,
      number: () => ParsingState.Offset,
      squareBracket: () => ParsingState.Offset,
      word: () => ParsingState.Offset,
    },
    [ParsingState.TwentyFourSeven]: {
      slash: () => ParsingState.TwentyFourSeven,
      space: () => ParsingState.Empty,
      number: () => ParsingState.TwentyFourSeven,
      semicolon: () => ParsingState.Empty,
    },
    [ParsingState.MonthFirst]: {
      space: () => ParsingState.Empty,
      dash: () => ParsingState.MonthLast,
      comma: () => ParsingState.MonthFirst,
    },
    [ParsingState.MonthLast]: {},
    [ParsingState.Off]: {
      semicolon: () => ParsingState.Empty,
    },
    [ParsingState.Fest]: {
      space: () => ParsingState.Empty,
      word: fest_word,
    },
  }

  const getNewState = (token: Lexer.Token): ParsingState => {
    try {
      const stateFunction = parsingStateMachine[state.value][token.type]

      if (!stateFunction) {
        throw new ParsingError(
          `No state function found for state ${state.value} and token type ${token.type}`
        )
      }

      debug('State resolution!', token.type, '->', `${stateFunction.name}()`)

      return stateFunction()
    } catch (error) {
      throw new ParsingError(error, 'getNewState')
    }
  }

  while (cursor.value < input.length) {
    try {
      const newState = getNewState(peekCurrentToken())

      state.value = newState

      if (cursor.value >= input.length - 1) {
        break
      }

      cursor.value++
    } catch (error) {
      throw new ParsingError(error, 'parse', input[cursor.value])
    }
  }

  finaliseWipNode()

  return result
}
