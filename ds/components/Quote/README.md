Quote from @omer/ds. Use via `window.OmerDS.Quote` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface QuoteProps {
  text: string;
  source?: string;
}
```

## Examples

### WithSource

```jsx
() => <div style={{ width: 400 }}><Quote text="וּסְפַרְתֶּם לָכֶם — שתהא הספירה שלכם, לתקן את עצמכם" source="על פי חז״ל" /></div>
```

### Plain

```jsx
() => <div style={{ width: 400 }}><Quote text="כל יום בספירה הוא מדרגה חדשה" /></div>
```
