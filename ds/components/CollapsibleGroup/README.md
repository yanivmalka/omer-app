CollapsibleGroup from @omer/ds. Use via `window.OmerDS.CollapsibleGroup` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface CollapsibleGroupProps {
  title: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: (open: boolean) => void;
  children?: React.ReactNode;
}
```

## Examples

### Open

```jsx
() => (
  <div style={{ width: 420 }}><Siddur>
    <CollapsibleGroup title="לפני הספירה">
      <PrayerSection title="לשם יחוד">לְשֵׁם יִחוּד קוּדְשָׁא בְּרִיךְ הוּא וּשְׁכִינְתֵּיהּ, בִּדְחִילוּ וּרְחִימוּ, לְיַחֲד שֵׁם י"ה בו"ה בְּיִחוּדָא שְׁלִים בְּשֵׁם כָּל יִשְׂרָאֵל.</PrayerSection>
    </CollapsibleGroup>
  </Siddur></div>
)
```

### Collapsed

```jsx
() => (
  <div style={{ width: 420 }}><Siddur>
    <CollapsibleGroup title="אחרי הספירה" defaultOpen={false}><PrayerSection>…</PrayerSection></CollapsibleGroup>
  </Siddur></div>
)
```
