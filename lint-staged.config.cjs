const path = require('path')

function ensureArray(obj) {
  if (obj == null) return []
  return Array.isArray(obj) ? obj : [obj]
}

function fileNamesToCliArg(names, base = process.cwd()) {
  return names.map(f => path.relative(base, f)).join(' ')
}

const wrap = fn => next => (filenames, commands) =>
  ensureArray(next(filenames, ensureArray(commands))).concat(fn(filenames))

const finish = (filenames, commands) => commands

const prettier = wrap(filenames => {
  if (!filenames.length) return []

  const cliFileNames = fileNamesToCliArg(filenames)

  return ['pnpm prettier --write ' + cliFileNames]
})

const js = prettier(finish)
const css = prettier(finish)
const md = prettier(finish)

module.exports = {
  '*.{ts,tsx}': js,
  '*.{js,jsx}': js,
  '*.{css,scss,sass,less}': css,
  '*.{md,mdx}': md,
}
