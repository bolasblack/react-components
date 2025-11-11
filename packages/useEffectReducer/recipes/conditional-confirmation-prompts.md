# Conditional Confirmation Prompts

[查看中文版](./conditional-confirmation-prompts.zh.md)

## Problem

You need to show a confirmation dialog before performing certain actions, but only under specific conditions. The confirmation should be skipped if it's already been approved or if the condition doesn't apply.

## Solution

Use the reducer to detect when confirmation is needed and return an effect with the pending action. The effect handler shows the confirmation, and on approval, re-dispatches the original action with a confirmation flag.

### Pattern

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
  onConfirmed: Action // The original action to re-dispatch
  warningMessage: string
}

const reducer = (state: State, action: Action): [State, Effect?] => {
  // Check if this action needs confirmation
  const needsConfirmation =
    action.type === 'DANGEROUS_ACTION' &&
    !state.confirmationAcknowledged &&
    !action.meta?.confirmed

  if (needsConfirmation) {
    // Return effect to show confirmation dialog
    return [
      state,
      {
        type: 'CONFIRM_ACTION',
        warningMessage: 'This action cannot be undone',
        onConfirmed: {
          ...action,
          meta: { ...action.meta, confirmed: true },
        },
      },
    ]
  }

  // Action is confirmed (or doesn't need confirmation)
  // Update the state if this was a dangerous action
  if (action.type === 'DANGEROUS_ACTION' && action.meta?.confirmed) {
    return [
      {
        ...state,
        confirmationAcknowledged: true,
        // ... perform the dangerous action
      },
    ]
  }

  // Handle other actions...
  return [state]
}

const onEffect = (effect: Effect, ctx) => {
  if (effect.type === 'CONFIRM_ACTION') {
    // Show confirmation dialog
    const confirmed = window.confirm(effect.warningMessage)
    if (confirmed) {
      // User confirmed, re-dispatch the action with confirmation flag
      ctx.dispatch(effect.onConfirmed)
    }
    // If not confirmed, do nothing (action is cancelled)
  }
}
```

## Key Points

1. **Confirmation state is tracked**: Either at the state level (`confirmationAcknowledged`) or in action metadata (`confirmed`)

2. **Original action is preserved**: The effect includes the complete original action with added confirmation flag

3. **Conditional logic in reducer**: The reducer decides whether confirmation is needed based on current state and action context

4. **Effect handler is UI-agnostic**: You can swap `window.confirm` for a modal, toast, or any other UI without changing the reducer

5. **Graceful cancellation**: If the user declines, nothing happens - no need for special "CANCELLED" actions

## Benefits

- **Testable logic**: Confirmation conditions are pure functions in the reducer
- **No state pollution**: Temporary "pending action" state isn't needed
- **Flexible UI**: Effect handler can use any confirmation UI (modals, toasts, etc.)
- **Clear flow**: The pattern makes it obvious when and why confirmation is needed
