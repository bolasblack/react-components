import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'
import { lint } from './lint.ts'
import { getReactLegacyPackages, rootDir } from './workspace_packages.ts'

function main(): void {
  const packages = getReactLegacyPackages()

  if (packages.length === 0) {
    throw new Error('No packages use catalog:peerDepsReact16')
  }

  lint(packages)
  run('pnpm', [...packages.flatMap(pkg => ['--filter', pkg.name]), '-r', 'compile'])
  run('pnpm', ['exec', 'vitest', 'run', ...process.argv.slice(2)], {
    env: { ...process.env, REACT_LEGACY_TEST: '1' },
  })
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
