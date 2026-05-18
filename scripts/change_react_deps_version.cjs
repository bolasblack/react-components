const fs = require('fs')
const path = require('path')

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
  fs.writeFileSync(
    path.resolve(__dirname, '../package.json'),
    `${JSON.stringify(updateVersion(process.argv[2], require('../package.json')), null, '  ')}\n`,
  )
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

function getCompatibilityVersions(version) {
  const major = String(version).match(/\d+/)?.[0]
  const versions = compatibilityVersions[major]

  if (!versions) {
    throw new Error(`Unsupported React version: ${version}`)
  }

  return versions
}

module.exports = { updateVersion }
