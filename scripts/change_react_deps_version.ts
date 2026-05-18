import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageJsonPath = path.resolve(scriptDir, '../package.json')
const workspacePath = path.resolve(scriptDir, '../pnpm-workspace.yaml')

type PackageJson = {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  [key: string]: unknown
}

type CompatibilityVersions = {
  reactTypes: string
  reactDomTypes: string
  testingLibraryReact: string
  testingLibraryReactHooks?: string
}

const compatibilityVersions: Record<string, CompatibilityVersions> = {
  16: {
    reactTypes: '^16.14.69',
    reactDomTypes: '^16.9.25',
    testingLibraryReact: '^12.1.5',
    testingLibraryReactHooks: '^8.0.1',
  },
  17: {
    reactTypes: '^17.0.91',
    reactDomTypes: '^17.0.26',
    testingLibraryReact: '^12.1.5',
    testingLibraryReactHooks: '^8.0.1',
  },
  18: {
    reactTypes: '^18.3.28',
    reactDomTypes: '^18.3.7',
    testingLibraryReact: '^16.3.2',
  },
  19: {
    reactTypes: '^19.2.14',
    reactDomTypes: '^19.2.3',
    testingLibraryReact: '^16.3.2',
  },
}

if (isMain()) {
  const version = process.argv[2]

  if (!version) {
    throw new Error('React version is required')
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as PackageJson

  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(updateVersion(version, packageJson), null, '  ')}\n`,
  )
  writeFileSync(workspacePath, updateWorkspaceVersion(version, readFileSync(workspacePath, 'utf8')))
}

export function updateVersion(version: string, pkgs: PackageJson): PackageJson {
  const versions = getCompatibilityVersions(version)
  const devDependencies = {
    ...pkgs.devDependencies,
    '@testing-library/react': versions.testingLibraryReact,
  }

  if (versions.testingLibraryReactHooks) {
    devDependencies['@testing-library/react-hooks'] = versions.testingLibraryReactHooks
  } else {
    delete devDependencies['@testing-library/react-hooks']
  }

  return {
    ...pkgs,
    dependencies: {
      ...pkgs.dependencies,
      '@types/react': versions.reactTypes,
      '@types/react-dom': versions.reactDomTypes,
      react: version,
      'react-dom': version,
    },
    devDependencies,
  }
}

export function updateWorkspaceVersion(version: string, workspace: string): string {
  const major = Number(getReactMajor(version))
  const versions = getCompatibilityVersions(version)
  const catalogVersions = {
    '@types/react': versions.reactTypes,
    '@types/react-dom': versions.reactDomTypes,
    react: version,
    'react-dom': version,
  }

  let updated = updateCatalog(workspace, 'peerDepsReact16', catalogVersions)
  if (major >= 18) {
    updated = updateCatalog(updated, 'peerDepsReact18', catalogVersions)
  }

  return updated
}

function updateCatalog(
  workspace: string,
  catalogName: string,
  versions: Record<string, string>,
): string {
  const lines = workspace.split('\n')
  const start = lines.findIndex(line => line === `  ${catalogName}:`)

  if (start === -1) {
    throw new Error(`Cannot find catalog: ${catalogName}`)
  }

  let end = start + 1
  while (end < lines.length && lines[end].startsWith('    ')) {
    end++
  }

  lines.splice(
    start,
    end - start,
    `  ${catalogName}:`,
    `    '@types/react': ${versions['@types/react']}`,
    `    '@types/react-dom': ${versions['@types/react-dom']}`,
    `    react: ${versions.react}`,
    `    react-dom: ${versions['react-dom']}`,
  )

  return lines.join('\n')
}

function getCompatibilityVersions(version: string): CompatibilityVersions {
  const major = getReactMajor(version)
  const versions = compatibilityVersions[major]

  if (!versions) {
    throw new Error(`Unsupported React version: ${version}`)
  }

  return versions
}

function getReactMajor(version: string): string {
  const major = version.match(/\d+/)?.[0]

  if (!major) {
    throw new Error(`Unsupported React version: ${version}`)
  }

  return major
}

function isMain(): boolean {
  return process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href
}
