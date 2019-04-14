import React from 'react'
import { mount } from 'enzyme'
import { DocumentElement } from './DocumentElement'

describe(DocumentElement.name, () => {
  it('works', () => {
    const wrapper = mount(
      <DocumentElement
        className="html-class"
        style={{
          display: 'flex',
          width: '10px',
        }}
      />,
    )
    expect(Array.from(document.documentElement.classList)).toEqual([
      'html-class',
    ])
    expect(document.documentElement.style.cssText).toBe(
      'display: flex; width: 10px;',
    )
    wrapper.unmount()
    expect(document.title).toBe('')
    expect(Array.from(document.documentElement.classList)).toEqual([])
    expect(document.documentElement.style.cssText).toBe('')
  })

  it('support nesting', () => {
    const wrapper = mount(
      <DocumentElement
        className="html-class-1"
        style={{ display: 'flex', width: '10px' }}
      >
        <div>
          <DocumentElement className="html-class-2" style={{ height: 'auto' }}>
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
      'html-class-2',
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
