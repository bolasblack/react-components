import * as React from 'react'
import { mount, ReactWrapper } from 'enzyme'
import { DocumentElement } from './DocumentElement'

describe(DocumentElement.name, () => {
  let wrapper: ReactWrapper

  afterEach(() => {
    try {
      wrapper.unmount()
    } catch {}
  })

  it('works', () => {
    wrapper = mount(
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
      'display: flex; width: 10px;',
    )
    // jsdom not support css variable
    // https://github.com/jsdom/jsdom/issues/1895
    // expect(document.documentElement.style.getPropertyValue('--test-var')).toBe(
    //   '20px',
    // )
    wrapper.unmount()
    expect(document.title).toBe('')
    expect(Array.from(document.documentElement.classList)).toEqual([])
    expect(document.documentElement.style.cssText).toBe('')
  })

  it('support nesting', () => {
    wrapper = mount(
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
