import withSideEffect from 'react-side-effect'
import { uniq, join, split, pipe, filter } from 'ramda'
import { SimpleJSON } from '@c4605-toolkit/ts-types'

export interface HtmlProps {
  /** specify document.title */
  title?: string
  /** specify class in html tag */
  className?: string
  /** specify style in html tag */
  style?: React.CSSProperties & SimpleJSON
}

/**
 * Provides a declarative way to specify html attributes in a single-page app.
 * This component can be used on server side as well.
 *
 * Built with [React Side Effect](https://github.com/gaearon/react-side-effect).
 *
 * Inspired by [React Document Title](https://github.com/gaearon/react-document-title).
 *
 * ## Features
 *
 * * Can be defined in many places throughout the application;
 * * Supports arbitrary levels of nesting, so you can define app-wide and page-specific titles;
 * * Works just as well with isomorphic apps.
 */
export const _HtmlForStorybook: React.SFC<HtmlProps> = ({ children }) =>
  (children || null) as any

_HtmlForStorybook.displayName = 'Html'

const mergeClassNames = pipe(
  join(' '),
  split(' '),
  uniq,
  filter(Boolean),
  join(' '),
)

function reducePropsToState(propsList: HtmlProps[]) {
  const mergedProps = Object.assign({}, ...propsList)
  const mergedStyle = Object.assign({}, ...propsList.map(p => p.style || {}))
  const classNames = propsList.map(p => p.className || '')

  return {
    title: mergedProps.title,
    style: mergedStyle,
    className: mergeClassNames(classNames),
  }
}

function handleStateChangeOnClient(
  props: ReturnType<typeof reducePropsToState>,
) {
  const nextTitle = props.title || ''
  if (nextTitle !== document.title) {
    document.title = nextTitle
  }

  const { documentElement } = document

  documentElement.style.cssText = ''
  if (props.style) {
    Object.assign(documentElement.style, props.style)
    Object.keys(props.style)
      .filter(k => k.startsWith('--'))
      .forEach(k => documentElement.style.setProperty(k, props.style![k]))
  }

  const nextClassName = props.className || ''
  if (nextClassName !== documentElement.className) {
    documentElement.className = nextClassName
  }
}

export const Html = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient,
)(_HtmlForStorybook)
