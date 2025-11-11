# 条件确认提示

[View English version](./conditional-confirmation-prompts.md)

## 问题

在执行某些操作之前需要显示确认对话框，但只在特定条件下显示。如果已经获得批准或条件不适用，则应跳过确认。

## 解决方案

使用 reducer 检测何时需要确认，并返回一个带有待处理操作的 effect。effect 处理器显示确认对话框，在获得批准后，重新分发带有确认标志的原始 action。

### 模式

```typescript
type State = {
  data: YourData
  confirmationAcknowledged: boolean
}

type Action =
  | { type: 'DANGEROUS_ACTION' }
  | ({ type: 'SAFE_ACTION' } & {
      meta?: {
        confirmed?: boolean
      }
    })

type Effect = {
  type: 'CONFIRM_ACTION'
  onConfirmed: Action // 重新分发的原始 action
  warningMessage: string
}

const reducer = (state: State, action: Action): [State, Effect?] => {
  // 检查此 action 是否需要确认
  const needsConfirmation =
    action.type === 'DANGEROUS_ACTION' &&
    !state.confirmationAcknowledged &&
    !action.meta?.confirmed

  if (needsConfirmation) {
    // 返回 effect 以显示确认对话框
    return [
      state,
      {
        type: 'CONFIRM_ACTION',
        warningMessage: '此操作无法撤销',
        onConfirmed: {
          ...action,
          meta: { ...action.meta, confirmed: true },
        },
      },
    ]
  }

  // Action 已确认（或不需要确认）
  // 如果这是一个危险操作，更新状态
  if (action.type === 'DANGEROUS_ACTION' && action.meta?.confirmed) {
    return [
      {
        ...state,
        confirmationAcknowledged: true,
        // ... 执行危险操作
      },
    ]
  }

  // 处理其他 actions...
  return [state]
}

const onEffect = (effect: Effect, ctx) => {
  if (effect.type === 'CONFIRM_ACTION') {
    // 显示确认对话框
    const confirmed = window.confirm(effect.warningMessage)
    if (confirmed) {
      // 用户确认，重新分发带有确认标志的 action
      ctx.dispatch(effect.onConfirmed)
    }
    // 如果未确认，什么也不做（action 被取消）
  }
}
```

## 要点

1. **跟踪确认状态**：可以在状态层面（`confirmationAcknowledged`）或在 action 元数据中（`confirmed`）跟踪

2. **保留原始 action**：effect 包含完整的原始 action 并添加了确认标志

3. **Reducer 中的条件逻辑**：reducer 根据当前状态和 action 上下文决定是否需要确认

4. **Effect 处理器与 UI 无关**：可以将 `window.confirm` 替换为模态框、提示框或任何其他 UI，而无需更改 reducer

5. **优雅的取消**：如果用户拒绝，什么也不会发生 - 不需要特殊的 "CANCELLED" actions

## 优势

- **可测试的逻辑**：确认条件是 reducer 中的纯函数
- **无状态污染**：不需要临时的 "待处理 action" 状态
- **灵活的 UI**：effect 处理器可以使用任何确认 UI（模态框、提示框等）
- **清晰的流程**：这种模式清楚地表明何时以及为何需要确认
