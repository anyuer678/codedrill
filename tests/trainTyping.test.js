import { describe, it, expect } from 'vitest'
import { tokenizeLine, classifyToken, diffLineTokens, lineEqualsTrimmed } from '../src/lib/trainTyping'

describe('tokenizeLine', () => {
  it('空行返回 empty token', () => {
    expect(tokenizeLine('')).toEqual([{ text: ' ', type: 'empty' }])
  })

  it('拆分关键字/标识符/数字/分隔符/字符串', () => {
    const tokens = tokenizeLine('int x = 10;', 'Java')
    const types = tokens.map((t) => t.type)
    expect(types).toContain('keyword')
    expect(types).toContain('number')
    expect(types).toContain('delimiter')
    const texts = tokens.map((t) => t.text)
    expect(texts).toContain('int')
    expect(texts).toContain('x')
    expect(texts).toContain('10')
  })

  it('字符串字面量作为整体 token', () => {
    const tokens = tokenizeLine('String s = "hello world";', 'Java')
    const str = tokens.find((t) => t.type === 'string')
    expect(str.text).toBe('"hello world"')
  })

  it('连续运算符合并', () => {
    const tokens = tokenizeLine('a <= b', 'Java')
    const op = tokens.find((t) => t.text === '<=')
    expect(op).toBeTruthy()
  })

  it('Python 关键字按语言识别', () => {
    expect(classifyToken('elif', 'Python')).toBe('keyword')
    expect(classifyToken('elif', 'Java')).toBe('identifier')
  })
})

describe('diffLineTokens', () => {
  const ref = tokenizeLine('int x = 10;', 'Java')
  const good = tokenizeLine('int x = 10;', 'Java')
  const bad = tokenizeLine('int y = 20;', 'Java')

  it('完全正确全部 correct', () => {
    const r = diffLineTokens(ref, good)
    expect(r.every((t) => t.status === 'correct')).toBe(true)
  })

  it('不一致的 token 标 wrong', () => {
    const r = diffLineTokens(ref, bad)
    expect(r.some((t) => t.status === 'wrong')).toBe(true)
    expect(r.some((t) => t.status === 'correct')).toBe(true)
  })

  it('includePending 时补出未输入部分', () => {
    const partial = tokenizeLine('int', 'Java')
    const r = diffLineTokens(ref, partial, { includePending: true })
    expect(r.some((t) => t.status === 'pending')).toBe(true)
  })

  it('不含 includePending 时跳过未输入部分', () => {
    const partial = tokenizeLine('int', 'Java')
    const r = diffLineTokens(ref, partial)
    expect(r.some((t) => t.status === 'pending')).toBe(false)
  })

  it('多余输入标 extra', () => {
    const extra = tokenizeLine('int x = 10; // extra', 'Java')
    const r = diffLineTokens(ref, extra)
    expect(r.some((t) => t.status === 'extra')).toBe(true)
  })
})

describe('lineEqualsTrimmed', () => {
  it('trim 后相等为 ✓', () => {
    expect(lineEqualsTrimmed('int x;', '  int x; ')).toBe('✓')
  })
  it('不等为 ✗，空输入为空', () => {
    expect(lineEqualsTrimmed('int x;', 'int y;')).toBe('✗')
    expect(lineEqualsTrimmed('int x;', '')).toBe('')
  })
})
