import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { getReactLegacyPackages, getWorkspacePackages, rootDir } from './workspace_packages.ts'

export function lint(packages = getWorkspacePackages()): void {
  const packageDirs = packages.map(pkg => pkg.dir)

  run('pnpm', ['exec', 'oxlint', ...packageDirs])
  run('pnpm', [
    'exec',
    'oxfmt',
    '--check',
    ...packageDirs.map(dir => `${dir}/src/**/*.{js,jsx,ts,tsx}`),
  ])
}

function main(): void {
  lint(process.argv.includes('--react-legacy') ? getReactLegacyPackages() : getWorkspacePackages())
}

function run(command: string, args: string[], options: { env?: NodeJS.ProcessEnv } = {}): void {
  const result = spawnSync(resolveCommand(command), args, {
    cwd: rootDir,
    env: options.env ?? process.env,
    stdio: 'inherit',
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function resolveCommand(command: string): string {
  return process.platform === 'win32' ? `${command}.cmd` : command
}

function isMain(): boolean {
  return process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href
}

if (isMain()) {
  main()
}
