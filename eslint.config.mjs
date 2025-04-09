import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const compat = new FlatCompat({
  baseDirectory: __dirname,
})
// Import your existing eslintrc.js as a module
import eslintrc from "./.eslintrc.js";

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config(eslintrc),
]

export default eslintConfig
