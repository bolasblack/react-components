import { values } from 'ramda'

export const getMdStoryCtx = (componentName: string) => {
  const reactClassInfo = values((window as any).STORYBOOK_REACT_CLASSES).find(
    info => info.name === componentName,
  )

  if (reactClassInfo) {
    const componentDesc = reactClassInfo.docgenInfo.description
    reactClassInfo.docgenInfo.description = ''
    return {
      info: {
        text: componentDesc,
      },
    }
  } else {
    return {}
  }
}
