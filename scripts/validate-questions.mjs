#!/usr/bin/env node
/**
 * 题库校验流水线：对 core/questions/*.json 全量校验
 * 用法：node scripts/validate-questions.mjs [--json]
 */

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const QUESTIONS_DIR = join(import.meta.dirname, '..', 'core', 'questions')
const jsonOutput = process.argv.includes('--json')

// ---- 1. 扫描所有 JSON 文件 ----
const files = readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json'))

// ---- 2. 加载并校验 ----
const allQuestions = []
const errors = []
const idSet = new Set()

for (const file of files) {
  const filePath = join(QUESTIONS_DIR, file)
  let data
  try {
    data = JSON.parse(readFileSync(filePath, 'utf-8'))
  } catch (e) {
    errors.push({ file, error: `JSON 解析失败: ${e.message}` })
    continue
  }

  if (!data.questions || !Array.isArray(data.questions)) {
    errors.push({ file, error: '缺少 questions 数组' })
    continue
  }

  for (const q of data.questions) {
    const qId = q.id || `${file}:${allQuestions.length}`

    // ID 唯一性
    if (idSet.has(qId)) {
      errors.push({ file, id: qId, error: 'ID 重复' })
    }
    idSet.add(qId)

    // 字段齐全
    if (!q.type || !['copy', 'fill', 'debug'].includes(q.type)) {
      errors.push({ file, id: qId, error: `type 无效: ${q.type}` })
    }
    if (!q.difficulty || q.difficulty < 1 || q.difficulty > 3) {
      errors.push({ file, id: qId, error: `difficulty 无效: ${q.difficulty}` })
    }
    if (!q.code || q.code.trim() === '') {
      errors.push({ file, id: qId, error: 'code 为空' })
    }
    if (!q.explanation || q.explanation.trim() === '') {
      errors.push({ file, id: qId, error: 'explanation 为空' })
    }

    // fill 题：code_with_bug 必须与 code 不同
    if (q.type === 'fill' && q.code_with_bug && q.code_with_bug === q.code) {
      errors.push({ file, id: qId, error: 'fill 题 code_with_bug 与 code 相同' })
    }

    allQuestions.push({ ...q, _file: file })
  }
}

// ---- 3. 统计 ----
const langStats = {}
const diffStats = { 1: 0, 2: 0, 3: 0 }
for (const q of allQuestions) {
  const lang = q.language || 'unknown'
  langStats[lang] = (langStats[lang] || 0) + 1
  diffStats[q.difficulty] = (diffStats[q.difficulty] || 0) + 1
}

// ---- 4. 输出 ----
if (jsonOutput) {
  console.log(JSON.stringify({
    total: allQuestions.length,
    files: files.length,
    languages: langStats,
    difficulty: diffStats,
    errors,
    errors_count: errors.length,
  }, null, 2))
} else {
  console.log(`\n📊 题库校验报告`)
  console.log(`   文件数: ${files.length}`)
  console.log(`   总题数: ${allQuestions.length}`)
  console.log(`   语言分布:`)
  for (const [lang, count] of Object.entries(langStats).sort((a, b) => b[1] - a[1])) {
    console.log(`     ${lang}: ${count}`)
  }
  console.log(`   难度分布: EASY=${diffStats[1]} MEDIUM=${diffStats[2]} HARD=${diffStats[3]}`)
  console.log(`   错误数: ${errors.length}`)
  if (errors.length > 0) {
    console.log(`\n❌ 错误清单:`)
    for (const e of errors) {
      console.log(`   [${e.file}] ${e.id || ''} — ${e.error}`)
    }
  } else {
    console.log(`\n✅ 全部通过`)
  }
}

// 退出码：有错误则非零
process.exit(errors.length > 0 ? 1 : 0)
