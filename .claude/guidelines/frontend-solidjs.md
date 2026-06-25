# Frontend Engineering Guidelines — Digital Multiverse

## Core Stack

- **Framework:** SolidJS 1.8+ — signal-based reactivity, NO Virtual DOM
- **Language:** TypeScript 5.0+ strict mode
- **Build tool:** Vite 5.0+
- **Styling:** Tailwind CSS (modular design system, dark mode, glassmorphism tokens)

## SolidJS — Critical rules

**No prop destructuring.** This is the most common SolidJS mistake.
Destructuring breaks Proxy-based reactivity.

```typescript
// ✅ Always access via props.name
const MyComponent = (props: Props) => <div>{props.name}</div>;

// ❌ NEVER destructure props
const MyComponent = ({ name }: Props) => <div>{name}</div>;
```

**Use Solid control flows** — never `.map()` or nested ternaries in JSX:

```typescript
// ✅
<For each={items()}>{(item) => <Item data={item} />}</For>
<Show when={isLoading()}><Spinner /></Show>
<Switch>
  <Match when={status() === 'error'}><Error /></Match>
  <Match when={status() === 'success'}><Content /></Match>
</Switch>

// ❌
{items().map(item => <Item data={item} />)}
{isLoading() ? <Spinner /> : null}
```

**Signals over heavy state.** Default to `createSignal`. Use `createStore`
only for nested reactive objects.

## Component rules

- Single Responsibility Component (SRC): one component does exactly one thing
- Components ≤ 150 lines of JSX — if longer, split
- Separate data fetching (services/hooks) from presentation (pure UI via props)
- Smart components fetch data; dumb components render props
- No magic numbers — map hardcoded values to config constants or design tokens

## File structure

```
src/
├── components/        # pure UI, dumb components
├── features/          # smart components + their local services
├── services/          # data fetching, API clients
├── hooks/             # createResource wrappers, custom signals
├── types/             # domain interfaces and types
├── utils/             # pure functions, no side effects
└── constants/         # config values, design tokens
```

## State management

- Local UI state: `createSignal`
- Derived state: `createMemo`
- Side effects: `createEffect` — keep them focused and minimal
- Global state: Solid context + `createStore` — only when truly shared
- Server data: `createResource` with proper error/loading handling

## Styling

- Tailwind utility classes — no inline styles
- Dark mode via Tailwind's `dark:` variant
- Design tokens live in `tailwind.config.ts` — no hardcoded colors in components
- Glassmorphism: use defined token classes, not ad-hoc `backdrop-blur` values
