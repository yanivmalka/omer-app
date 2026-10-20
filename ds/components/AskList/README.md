AskList from @omer/ds. Use via `window.OmerDS.AskList` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface AskListProps {
  children?: React.ReactNode;
}
```

## Examples

### MissedDays

```jsx
() => (
  <div style={{ width: 400 }}>
    <h2 style={{ fontFamily: 'var(--serif)', margin: '0 0 6px', fontSize: '1.3rem' }}>האם ספרת בימים האלה?</h2>
    <AskList>
      <AskItem label="יום כ' (20)" />
      <AskItem label='יום כ"א (21)' />
    </AskList>
    <div className="row" style={{ justifyContent: 'space-between' }}><Button variant="ghost" size="small">ספרתי בכולם</Button><Button>שמור</Button></div>
  </div>
)
```
