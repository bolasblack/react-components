import { mount } from 'enzyme'
import { Html } from './Html'

describe('Html', () => {
  it('works', () => {
    const wrapper = mount(
      <Html
        title="Html title"
        className="html-class"
        style={{
          display: 'flex',
          width: '10px',
        }}
      />,
    )
    expect(document.title).toBe('Html title')
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
      <Html
        title="Html title 1"
        className="html-class-1"
        style={{ display: 'flex', width: '10px' }}
      >
        <div>
          <Html
            title="Html title 2"
            className="html-class-2"
            style={{ height: 'auto' }}
          >
            <span>
              <Html
                title="Html title 3"
                className="html-class-3"
                style={{ overflow: 'hidden' }}
              >
                Text
              </Html>
            </span>
          </Html>
        </div>
      </Html>,
    )
    expect(document.title).toBe('Html title 3')
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
