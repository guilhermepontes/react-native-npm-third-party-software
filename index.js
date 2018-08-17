(async () => {
  const FileHound = require('filehound')
  const fs = require('fs')
  const util = require('util')
  const readFile = util.promisify(fs.readFile)

  const currentPath = process.cwd()
  const dependenciesFile = `${currentPath}/package.json`

  if (!fs.existsSync(dependenciesFile)) {
    return console.log('[license-generator] No package.json found')
  }

  const { dependencies } = require(dependenciesFile)

  if (!dependencies) {
    return console.log('[license-generator] No dependencies found')
  }

  const dependenciePaths = Object.keys(dependencies).map(dependency => (
    `${currentPath}/node_modules/${dependency}`
  ));

  const dependenciesInfo = await FileHound.create()
    .paths(dependenciePaths)
    .depth(1)
    .match('package.json')
    .find()

  dependenciesInfo.map(async dep => {
    const data = await readFile(dep, 'utf8')
    const { name, licenses, license } = JSON.parse(data.toString());

    const licenceName = licenses
      ? licenses.map(license => license.type).join(', ')
      : license
        ? license
        : 'License not found'
  })
})()
