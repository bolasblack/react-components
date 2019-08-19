const fs = require('fs')
const path = require('path')

fs.writeFileSync(
  path.resolve(__dirname, '../package.json'),
  JSON.stringify(
    updateVersion(process.argv[2], require('../package.json')),
    null,
    '  ',
  ),
)

function updateVersion(version, pkgs) {
  const resolutions = { ...pkgs.resolutions }

  const reactResolutionKeys = Object.keys(pkgs.resolutions).filter(
    dep =>
      !dep.includes('@types') &&
      (/\/react$/.test(dep) ||
        /\/react-dom$/.test(dep) ||
        /\/react-test-renderer$/.test(dep)),
  )

  reactResolutionKeys.forEach(key => {
    resolutions[key] = version
  })

  return {
    ...pkgs,
    resolutions,
  }
}
