import ejs from 'ejs'
import glob from 'glob'
import ld, { flow } from 'lodash'
import { promises } from 'fs'
import sysPath from 'path'
import { of as of$, from as from$, empty as empty$, Observable } from 'rxjs'
import {
  map as map$,
  mergeMap as mergeMap$,
  filter as filter$,
} from 'rxjs/operators'

const { readFile, writeFile } = promises

const blankRE = '[\\t ]'

const fileNameMark = '@file-name'
const fileNameRE = `/\\*+${blankRE}*${fileNameMark}${blankRE}*(.*?)${blankRE}\\*+/\n*`

const startMark = '@template-comment'
const templateCommentRE = `/\\*+${blankRE}*${startMark}(?:\b.*)?\\n([^]*?)${blankRE}\\*+/\n?`

flow(
  readFiles,
  processFiles,
  writeFiles,
)(glob.sync(sysPath.resolve(__dirname, '../src/**/*.tpl.*'))).subscribe({
  complete() {
    console.log('finished')
  },
})

type Files = Observable<[string, string]>

function readFiles(files: string[]): Files {
  return from$(files).pipe(
    mergeMap$(path => from$(Promise.all([path, readFile(path)]))),
    mergeMap$(([path, content]) => {
      try {
        return of$<[string, string]>([path, content.toString()])
      } catch {
        return empty$()
      }
    }),
  )
}

function processFiles(files: Files): Files {
  return files.pipe(
    filter$(([path, content]) =>
      new RegExp(templateCommentRE, 'i').test(content),
    ),
    map$(
      ([path, content]) =>
        [
          getNewPathFromFile(path, content),
          getNewContentFromFile(path, content),
        ] as [string, string],
    ),
  )
}

function writeFiles(files: Files) {
  return files.pipe(
    mergeMap$(([path, content]) => from$(writeFile(path, content))),
  )
}

function getNewContentFromFile(path: string, content: string) {
  return content
    .replace(new RegExp(fileNameRE, 'ig'), '')
    .replace(new RegExp(templateCommentRE, 'ig'), ($, $1: string) => {
      return ejs.render($1, ld)
    })
}

function getNewPathFromFile(path: string, content: string) {
  const filenameMatches = content.match(new RegExp(fileNameRE, 'i'))
  let newPath: string
  if (filenameMatches) {
    newPath = sysPath.join(sysPath.dirname(path), filenameMatches[1])
  } else {
    newPath = addSecondExt('gen', path)
  }
  return newPath
}

function addSecondExt(ext: string, path: string) {
  const newBasename =
    sysPath.basename(path, sysPath.extname(path)) +
    `.${ext}` +
    sysPath.extname(path)
  return sysPath.join(sysPath.dirname(path), newBasename)
}
