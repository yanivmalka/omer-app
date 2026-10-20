Badge from @omer/ds. Use via `window.OmerDS.Badge` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface BadgeProps {
  icon?: string;
  earned?: boolean;
  title?: string;
  children?: React.ReactNode;
}
```

## Examples

### EarnedAndLocked

```jsx
() => (
  <div className="badges">
    <Badge icon="🕯️" earned>נר ראשון</Badge>
    <Badge icon="🌿" earned>שבוע של חסד</Badge>
    <Badge icon="⭐">ח"י שמות</Badge>
    <Badge icon="👑">שבעה שבועות</Badge>
  </div>
)
```
