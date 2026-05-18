const fs = require('fs')
const path = require('path')

const packageJsonPath = path.resolve(__dirname, '../package.json')
const workspacePath = path.resolve(__dirname, '../pnpm-workspace.yaml')

const compatibilityVersions = {
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

if (require.main === module) {
  const version = process.argv[2]
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(updateVersion(version, require(packageJsonPath)), null, '  ')}\n`,
  )
  fs.writeFileSync(workspacePath, updateWorkspaceVersion(version, fs.readFileSync(workspacePath, 'utf8')))
}

function updateVersion(version, pkgs) {
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

function updateWorkspaceVersion(version, workspace) {
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

function updateCatalog(workspace, catalogName, versions) {
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

function getCompatibilityVersions(version) {
  const major = getReactMajor(version)
  const versions = compatibilityVersions[major]

  if (!versions) {
    throw new Error(`Unsupported React version: ${version}`)
  }

  return versions
}

function getReactMajor(version) {
  return String(version).match(/\d+/)?.[0]
}

module.exports = { updateVersion, updateWorkspaceVersion }
