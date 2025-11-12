[Original Post](https://www.reddit.com/r/react/comments/1ov35kq/i_built_another_elmstyle_useeffectreducer_hook/)

Hey folks 👋

TL;DR – I’ve been playing with Elm-style “**state + event → state + effects**” in React and turned it into a tiny hook called `useEffectReducer`.

**Features:**

- 🧩 Tiny – single-file implementation
- 🧠 Simple – reducer type `(state, action) => [state, effect?]`
- ✅ Test covered

**Docs / Storybook:** [react-components.c4605.com](https://react-components.c4605.com/?path=/docs/library-use-effect-reducer--readme)  
**Repo:** [github.com/bolasblack/react-components](https://github.com/bolasblack/react-components/tree/develop/packages/useEffectReducer)

---

## What is “Elm-style”?

Elm popularized the **Model-View-Update (MVU)** pattern, where each update returns not only the next model but also the side-effects (commands) to run:

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
```

This idea keeps all logic about _“what happens when event X occurs”_ in **one place** — the update function — instead of scattering side-effects across random `useEffect`s.
It preserves the purity of reducers while making **when and what side-effects happen** explicit and interpretable by a runtime.

React’s docs echo the same philosophy: effects should be an _escape hatch_, not the default — see [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

> If you want to see a great example of how this kind of modeling makes UI logic elegant and maintainable, I recommend David Khourshid’s post [**“No, disabling a button is not app logic.”**](https://dev.to/davidkpiano/no-disabling-a-button-is-not-app-logic-598i) 💡

So I built another `useEffectReducer`.

---

## Why _another_ Elm-style reducer?

I know there are several similar libraries — and I like many of them! — but I wanted a variant with different trade-offs:

- 🧱 **Some are archived.** For example, `davidkpiano/useEffectReducer` and `react-use-bireducer` are now read-only. So I wanted something I’m comfortable with, depending on and tweaking.
- 🧪 **Effects as plain objects + separate interpreter.** I prefer returning serializable effect descriptors and implementing the _actual_ effect logic in one dedicated place. It’s easier to test reducers (assert on descriptors) without invoking real side-effects. (Elm’s `update : Msg -> Model -> (Model, Cmd Msg)` inspires this split.)  
  Of course, **`useEffectReducer` doesn’t stop you from returning a function as an effect** — the current API is flexible enough to support that; it’s just not my personal preference 🙂.
- ⚙️ **Keep it tiny.** Fits in one file with almost no dependencies — copy, tweak, or delete it whenever you want.
- 💬 **Lower the barrier.** I don’t want people curious about the Elm-style approach to feel like they must first learn a full-blown state-machine library like [XState](https://xstate.js.org/) or study Elm’s `Cmd Msg` system just to try this pattern.  
  I think both **XState** and **Elm** are _amazing_ — I’m genuinely thankful to David Khourshid and all of XState’s contributors, and to the Elm community.  
  I’ve used XState in multiple real projects (it’s saved me countless times!), but it does have a learning curve. Going from `useReducer` to `useEffectReducer`, on the other hand, should feel smooth and approachable 🚀.

**Example usage:** [Storybook demo → L121-L173](https://github.com/bolasblack/react-components/blob/develop/packages/useEffectReducer/src/useEffectReducer.stories.tsx#L121-L173)  
**Implementation:** [`useEffectReducer.ts`](https://github.com/bolasblack/react-components/blob/develop/packages/useEffectReducer/src/useEffectReducer.ts)

---

### Related work (worth checking out)

- **[`davidkpiano/useEffectReducer`](https://github.com/davidkpiano/useEffectReducer)** — by _David Khourshid_, effectful reducers via an `exec` helper; **archived**.
- **[`soywod/react-use-bireducer`](https://github.com/soywod/react-use-bireducer)** — returns `[state, effects]` and processes effects through a separate “effect reducer”; **archived**.
- **[`ncthbrt/react-use-elmish`](https://github.com/ncthbrt/react-use-elmish)** — Elmish-style hook combining reducer logic with helpers for async effects (`delay`, `promise`, etc.).
- **[`redux-loop`](https://github.com/redux-loop/redux-loop)** — Redux enhancer that adds Elm-like effect tuples to reducers.
- **[`useReducerWithEmitEffect`](https://gist.github.com/sophiebits/145c47544430c82abd617c9cdebefee8)** — Sophie Alpert’s original gist that inspired many of these explorations.
- **[`dai-shi/use-reducer-async`](https://github.com/dai-shi/use-reducer-async)** — extends `dispatch` to support async actions; not Elm-tuple-based but conceptually related.

---

I’d love feedback on the API shape, typing edge-cases, and where this pattern shines (or breaks).

Thanks for reading! 🙌
