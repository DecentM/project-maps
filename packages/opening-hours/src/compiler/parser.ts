import * as Lexer from './lexer.js'

import { Day, DayOfMonth, Hour, isDay, isDayOfMonth, isHour, isMinute, isMonth, Minute, Month } from '../opening-hours.js'
import { ParsingError } from './errors.js'

export type Ast = {
  type: 'root'
  children: Node[]
}

type SingleDay = {
  type: 'singleDay'
  day: Day | DayOfMonth
}

type DayRange = {
  type: 'dayRange'
  start: Day | DayOfMonth
  end: Day | DayOfMonth
}

type CustomTime = 'sunrise' | 'sunset'

const isCustomTime = (input: unknown): input is CustomTime => {
  return input === 'sunrise' || input === 'sunset'
}

type CustomFest = 'easter'

const isCustomFest = (input: unknown): input is CustomFest => {
  return input === 'easter'
}

const OffsetUnit = [
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
  'years'
] as const

type OffsetUnit = typeof OffsetUnit[number]

const isOffsetUnit = (input: unknown): input is OffsetUnit => {
  return OffsetUnit.includes(input as OffsetUnit)
}

type TimeRange = {
  type: 'timeRange'
  start: CustomTime | {
    hour: number
    minute: number
  },
  end?: CustomTime | {
    hour: number
    minute: number
  },
  endAmbiguous?: boolean
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

type TimeDayException = {
  type: 'timeDayException'
  number: number
}

type Fest = {
  type: 'fest'
  value: CustomFest
}

type OffsetNumber = {
  type: 'offsetNumber'
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
  | TimeDayException
  | Fest
  | OffsetNumber

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

    if (this.dayStart && !this.timeDayException) {
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
        endAmbiguous: this.endAmbiguous ?? false,
      }
    }

    if (
      this.timeStartHour !== null
      && this.timeStartMinute !== null
      && this.timeEndHour !== null
      && this.timeEndMinute !== null
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
        },
        endAmbiguous: this.endAmbiguous ?? false,
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

    if (this.timeDayException !== null) {
      return {
        type: 'timeDayException',
        number: this.timeDayException,
      }
    }

    if (this.fest) {
      return {
        type: 'fest',
        value: this.fest,
      }
    }

    if (this.offsetNumber !== null) {
      return {
        type: 'offsetNumber',
        value: this.offsetNumber,
        unit: this.offsetUnit ?? undefined,
      }
    }

    console.log(this)
    throw new ParsingError('WIP Node is incomplete, cannot finalise')
  }

  private offsetNumber: number | null = null

  public setOffsetNumber(value: number) {
    this.offsetNumber = value
  }

  private offsetUnit: OffsetUnit | null = null

  public setOffsetUnit(value: OffsetUnit) {
    this.offsetUnit = value
  }

  private dayStart: Day | DayOfMonth | null = null

  public setDayStart(day: Day | DayOfMonth) {
    this.dayStart = day
  }

  private dayEnd: Day | DayOfMonth | null = null

  public setDayEnd(day: Day | DayOfMonth) {
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

  private timeStartCustom: CustomTime | null = null

  public setTimeStartCustom(value: CustomTime) {
    this.timeStartCustom = value
  }

  private timeEndCustom: CustomTime | null = null

  public setTimeEndCustom(value: CustomTime) {
    this.timeEndCustom = value
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

  private endAmbiguous: boolean | null = null

  public setEndAmbiguous() {
    this.endAmbiguous = true
  }

  private twentyFourSeven: boolean | null = null

  public setTwentyFourSeven() {
    this.twentyFourSeven = true
  }

  private off: boolean | null = null

  public setOff() {
    this.off = true
  }

  private timeDayException: number | null = null

  public setTimeDayException(number: number) {
    this.timeDayException = number
  }

  private fest: CustomFest | null = null

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
  TimeDayException = 'timeDayException',
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
        throw new ParsingError(`Cursor out of bounds: ${value} (length: ${input.length})`)
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
      throw new ParsingError('Unexpected end of input while parsing current token')
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
    if (current.type === 'dash') {
      return
    }

    let day: Day | DayOfMonth | null = null

    if (current.type === 'number') {
      const dayOfMonth = Number.parseInt(current.value, 10)

      if (!isDayOfMonth(dayOfMonth)) {
        return
      }

      day = dayOfMonth
    }

    if (current.type === 'word') {
      const dayString = current.value.substring(0, 2)

      if (!isDay(dayString)) {
        throw new ParsingError(`onDayFirst: Expected a day, got ${current.value} (${JSON.stringify(current)})`)
      }

      day = dayString
    }

    if (!day) {
      throw new ParsingError(`onDayFirst: Expected a word or number, got ${current.type} (${JSON.stringify(current)})`)
    }

    wipNode.setDayStart(day)
  }

  const onDayLast = (current: Lexer.Token) => {
    if (current.type === 'dash') {
      cursor.value++
      current = peekCurrentToken()
    }

    let day: Day | DayOfMonth | null = null

    if (current.type === 'number') {
      const dayOfMonth = Number.parseInt(current.value, 10)

      if (!isDayOfMonth(dayOfMonth)) {
        throw new ParsingError(`onDayLast: Expected a valid day of month, got ${current.value} (${JSON.stringify(current)})`)
      }

      day = dayOfMonth
    }

    if (current.type === 'word') {
      const dayString = current.value.substring(0, 2)

      if (!isDay(dayString)) {
        throw new ParsingError(`onDayLast: Expected a day, got ${current.value} (${JSON.stringify(current)})`)
      }

      day = dayString
    }

    if (!day) {
      throw new ParsingError(`onDayLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    wipNode.setDayEnd(day)
  }

  const onTimeFirstHour = (current: Lexer.Token) => {
    if (current.type === 'word') {
      if (!isCustomTime(current.value)) {
        throw new ParsingError(`onTimeFirstHour: Expected a custom time, got ${current.value} (${JSON.stringify(current)})`)
      }

      wipNode.setTimeStartCustom(current.value)
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(`onTimeFirstHour: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const hour = Number.parseInt(current.value, 10)

    if (!isHour(hour)) {
      throw new ParsingError(`onTimeFirstHour: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`)
    }

    debug('Setting time start hour', hour)
    wipNode.setTimeStartHour(hour)
  }

  const onTimeFirstMinute = (current: Lexer.Token) => {
    if (current.type === 'colon') {
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(`onTimeFirstMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new ParsingError(`onTimeFirstMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`)
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
        throw new ParsingError(`onTimeFirstHour: Expected a custom time, got ${current.value} (${JSON.stringify(current)})`)
      }

      wipNode.setTimeEndCustom(current.value)
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(`onTimeLastHour: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const hour = Number.parseInt(current.value, 10)

    if (!isHour(hour)) {
      throw new ParsingError(`onTimeLastHour: Expected a valid hour, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setTimeEndHour(current.value)
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
      throw new ParsingError(`onTimeLastMinute: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    const minute = Number.parseInt(current.value, 10)

    if (!isMinute(minute)) {
      throw new ParsingError(`onTimeLastMinute: Expected a valid minute, got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setTimeEndMinute(current.value)
  }

  const onTwentyFourSeven = (current: Lexer.Token) => {
    if (current.type !== 'number' && current.type !== 'slash') {
      throw new ParsingError(`onTwentyFourSeven: Expected a number or slash, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (current.type === 'number' && current.value !== '24' && current.value !== '7') {
      throw new ParsingError(`onTwentyFourSeven: Expected '24', got ${current.value} (${JSON.stringify(current)})`)
    }

    wipNode.setTwentyFourSeven()
  }

  const onMonthFirst = (current: Lexer.Token) => {
    if (current.type !== 'word') {
      throw new ParsingError(`onMonthFirst: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (!isMonth(current.value)) {
      throw new ParsingError(`onMonthFirst: Expected a month, got ${current.value} (${JSON.stringify(current)})`)
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
      throw new ParsingError(`onMonthLast: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (!isMonth(current.value)) {
      throw new ParsingError(`onMonthLast: Expected a month, got ${current.value} (${JSON.stringify(current)})`)
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

  const onTimeDayException = (current: Lexer.Token) => {
    if (current.type === 'squareBracket' || current.type === 'dash' || current.type === 'space') {
      return
    }

    if (current.type !== 'number') {
      throw new ParsingError(`onTimeDayException: Expected a number, got ${current.type} (${JSON.stringify(current)})`)
    }

    let number = Number.parseInt(current.value, 10)
    const prev = peekPreviousToken()

    if (prev?.type === 'dash') {
      number = -number
    }

    wipNode.setTimeDayException(number)
  }

  const onFest = (current: Lexer.Token) => {
    if (current.type === 'space') {
      return
    }

    if (current.type !== 'word') {
      throw new ParsingError(`onFest: Expected a word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (isCustomFest(current.value)) {
      wipNode.setFest(current.value)
      return
    }

    if (isOffsetUnit(current.value)) {
      return
    }

    throw new ParsingError(`onFest: Expected a custom fest, got ${current.value} (${JSON.stringify(current)})`)
  }

  const onOffset = (current: Lexer.Token) => {
    if (current.type !== 'number' && current.type !== 'word') {
      throw new ParsingError(`onOffset: Expected a number or word, got ${current.type} (${JSON.stringify(current)})`)
    }

    if (current.type === 'number') {
      const value = Number.parseInt(current.value, 10)

      if (Number.isNaN(value)) {
        throw new ParsingError(`onOffset: Expected a valid number, got ${current.value} (${JSON.stringify(current)})`)
      }

      wipNode.setOffsetNumber(value)
      return
    }

    if (current.type === 'word') {
      if (!isOffsetUnit(current.value)) {
        throw new ParsingError(`onOffset: Expected a valid offset unit, got ${current.value} (${JSON.stringify(current)})`)
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
        case ParsingState.TimeDayException:
          onTimeDayException(current)
          break;
        case ParsingState.Fest:
          onFest(current)
          break;
        case ParsingState.Offset:
          onOffset(current)
          break;
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
        throw new ParsingError(`Expected a number, got ${current.type} (${JSON.stringify(current)})`)
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

          throw new ParsingError(`Unexpected token after number and slash: ${next.type} (${JSON.stringify(next)})`)
        }
        default:
          throw new ParsingError(`Unexpected token after number: ${next.type} (${JSON.stringify(next)})`)
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

      if (isDay(current.value.substring(0, 2))) {
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

  const timedayexception_squarebracket: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()

      if (current.type !== 'squareBracket') {
        throw new ParsingError(`Expected a square bracket, got ${current.type} (${JSON.stringify(current)})`)
      }

      if (current.value === 'close') {
        return ParsingState.Empty
      }

      return ParsingState.TimeDayException
    } catch (error) {
      throw new ParsingError(error, 'timedayexception_squarebracket')
    }
  }

  const timedayexception_space: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()
      const next = peekNextToken()

      if (!next) {
        return ParsingState.Empty
      }

      if (next.type === 'word' && isOffsetUnit(next.value)) {
        return ParsingState.TimeDayException
      }

      return ParsingState.Empty
    } catch (error) {
      throw new ParsingError(error, 'timedayexception_space')
    }
  }

  const dayfirst_squarebracket: ParsingStateFunction = () => {
    try {
      const current = peekCurrentToken()

      if (current.type !== 'squareBracket') {
        throw new ParsingError(`Expected a square bracket, got ${current.type} (${JSON.stringify(current)})`)
      }

      if (current.value === 'close') {
        throw new ParsingError('Unexpected closing square bracket in or after day range')
      }

      return ParsingState.TimeDayException
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

  const parsingStateMachine: Record<ParsingState, Partial<Record<Lexer.Token['type'], ParsingStateFunction>>> = {
    [ParsingState.Empty]: {
      number: empty_number,
      word: empty_word,
      space: () => ParsingState.Empty,
      semicolon: () => ParsingState.Empty,
      squareBracket: () => ParsingState.Empty,
      newline: () => ParsingState.Empty,
      dash: () => ParsingState.TimeDayException,
    },
    [ParsingState.DayFirst]: {
      number: () => ParsingState.DayFirst,
      space: () => ParsingState.Empty,
      dash: () => ParsingState.DayLast,
      comma: () => ParsingState.DayFirst,
      squareBracket: dayfirst_squarebracket,
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
    [ParsingState.TimeDayException]: {
      dash: () => ParsingState.TimeDayException,
      number: () => ParsingState.TimeDayException,
      squareBracket: timedayexception_squarebracket,
      space: timedayexception_space,
      word: () => ParsingState.Offset,
    },
    [ParsingState.Offset]: {
      space: offset_space,
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
    [ParsingState.MonthLast]: {
    },
    [ParsingState.Off]: {
      semicolon: () => ParsingState.Empty,
    },
    [ParsingState.Fest]: {
      space: () => ParsingState.Empty,
      word: fest_word,
    }
  }

  const getNewState = (token: Lexer.Token): ParsingState => {
    try {
      const stateFunction = parsingStateMachine[state.value][token.type]

      if (!stateFunction) {
        throw new ParsingError(`No state function found for state ${state.value} and token type ${token.type}`)
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
      // console.log('fatal', JSON.stringify(result, null, 2))

      throw new ParsingError(error, 'parse', input[cursor.value])
    }
  }

  finaliseWipNode()

  return result
}

const input = [
  'Mo 08:00-16:00; Mo[-2] 08:00-12:00;\n Dec 12 off;PH 08:00-16:00+;',
  'SH 10:00-14:00;Jan 12-14 24/7; Aug sunrise-sunset; easter -2 days off'
].join(' ')
const tokens = Lexer.lex(input)
const ast = parse(tokens)

console.log('\n===========================\n')
console.log(tokens)
console.log('\n===========================\n')
console.log(JSON.stringify(ast, null, 2))
