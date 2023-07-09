import * as React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { DocumentElement } from './DocumentElement'

describe(DocumentElement.name, () => {
  let wrapper: RenderResult

  afterEach(() => {
    try {
      wrapper.unmount()
    } catch {}
  })

  it('works', () => {
    wrapper = render(
      <DocumentElement
        className="html-class"
        style={{
          display: 'flex',
          width: '10px',
          '--test-var': '20px',
        }}
      />,
    )
    expect(Array.from(document.documentElement.classList)).toEqual([
      'html-class',
    ])
    expect(document.documentElement.style.cssText).toBe(
      'display: flex; width: 10px; --test-var: 20px;',
    )
    wrapper.unmount()
    expect(document.title).toBe('')
    expect(Array.from(document.documentElement.classList)).toEqual([])
    expect(document.documentElement.style.cssText).toBe('')
  })

  it('support nesting', () => {
    wrapper = render(
      <DocumentElement
        className="html-class-1"
        style={{ display: 'flex', width: '10px' }}
      >
        <div>
          <DocumentElement style={{ height: 'auto' }}>
            <span>
              <DocumentElement
                className="html-class-3"
                style={{ overflow: 'hidden' }}
              >
                Text
              </DocumentElement>
            </span>
          </DocumentElement>
        </div>
      </DocumentElement>,
    )
    expect(Array.from(document.documentElement.classList)).toEqual([
      'html-class-1',
      'html-class-3',
    ])
    expect(document.documentElement.style.cssText).toBe(
      'display: flex; width: 10px; height: auto; overflow: hidden;',
    )
    wrapper.unmount()
    expect(document.title).toBe('')
    expect(Array.from(document.documentElement.classList)).toEqual([])
    expect(document.documentElement.style.cssText).toBe('')
  })
})
