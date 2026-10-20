HesedSummary from @omer/ds. Use via `window.OmerDS.HesedSummary` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface HesedSummaryProps {
  entries: HesedEntry[];
}
```

## Examples

### WithNames

```jsx
() => (
  <div style={{ width: 400 }}><HesedSummary entries={[
    { name: 'יעקב בן שרה', purpose: 'לרפואת', when: '12.5 21:14' },
    { name: 'אברהם בן יצחק', purpose: 'לעילוי נשמת', when: '11.5 20:58' },
  ]} /></div>
)
```

### Empty

```jsx
() => <div style={{ width: 400 }}><HesedSummary entries={[]} /></div>
```
