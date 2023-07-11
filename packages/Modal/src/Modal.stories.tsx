import * as React from 'react'
import { useCallback, useState } from 'react'
import { Modal, useModal } from './Modal'
import { Meta, StoryFn } from '@storybook/react'

export default {
  title: 'Components/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>

export const BasicUsage: StoryFn = () => {
  const [visible, setVisible] = useState(false)
  const showModal = useCallback(() => setVisible(true), [setVisible])
  const hideModal = useCallback(() => setVisible(false), [setVisible])

  return (
    <>
      <button onClick={showModal}>show modal</button>

      <Modal visible={visible} onVisibleChange={setVisible}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '576px',
            width: 'calc(100vw - 72px)',
            height: '100px',
            borderRadius: '6px',
            background: '#fff',
          }}
        >
          <button onClick={hideModal}>hide modal</button>
        </div>
      </Modal>
    </>
  )
}

export const UseReactHook: StoryFn = () => {
  const [modal, helpers] = useModal({
    children: helpers => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '576px',
          width: 'calc(100vw - 72px)',
          height: '100px',
          borderRadius: '6px',
          background: '#fff',
        }}
      >
        <button onClick={helpers.hide}>hide modal</button>
      </div>
    ),
  })

  return (
    <>
      <button onClick={helpers.show}>show modal</button>
      {modal}
    </>
  )
}
