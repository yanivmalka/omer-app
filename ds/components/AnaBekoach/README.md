AnaBekoach from @omer/ds. Use via `window.OmerDS.AnaBekoach` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface AnaBekoachProps {
  day: number;
  nikud?: boolean;
}
```

## Examples

### Day33Letter

```jsx
() => <div style={{ width: 440 }}><AnaBekoach day={33} /></div>
```

### SeventhDayWholeName

```jsx
() => <div style={{ width: 440 }}><AnaBekoach day={14} /></div>
```

### NoNikud

```jsx
() => <div style={{ width: 440 }}><AnaBekoach day={1} nikud={false} /></div>
```
