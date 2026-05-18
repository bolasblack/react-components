const fs = require('fs')
const path = require('path')

if (require.main === module) {
  fs.writeFileSync(
    path.resolve(__dirname, '../package.json'),
    JSON.stringify(
      updateVersion(process.argv[2], require('../package.json')),
      null,
      '  ',
    ),
  )
}

function updateVersion(version, pkgs) {
  return {
    ...pkgs,
    dependencies: {
      ...pkgs.dependencies,
      react: version,
      'react-dom': version,
    },
  }
}

module.exports = { updateVersion }
