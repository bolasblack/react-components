import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
export const rootDir = path.resolve(scriptDir, '..')

const reactLegacyCatalog = 'catalog:peerDepsReact16'

type PackageManifest = {
  name: string
  peerDependencies?: Record<string, string>
}

export type WorkspacePackage = {
  dir: string
  manifest: PackageManifest
  name: string
}

export function getWorkspacePackages(root = rootDir): WorkspacePackage[] {
  const packagesDir = path.resolve(root, 'packages')

  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const packageDir = path.join(packagesDir, entry.name)
      const manifest = JSON.parse(
        readFileSync(path.join(packageDir, 'package.json'), 'utf8'),
      ) as PackageManifest

      return {
        dir: path.posix.join('packages', entry.name),
        manifest,
        name: manifest.name,
      }
    })
}

export function getReactLegacyPackages(root = rootDir): WorkspacePackage[] {
  return getWorkspacePackages(root)
    .filter(pkg => Object.values(pkg.manifest.peerDependencies ?? {}).includes(reactLegacyCatalog))
    .map(({ dir, manifest, name }) => ({ dir, manifest, name }))
}
