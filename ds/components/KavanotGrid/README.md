KavanotGrid from @omer/ds. Use via `window.OmerDS.KavanotGrid` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface KavanotGridProps {
  sefira: string;
  ana: string;
  psalmWord: string;
}
```

## Examples

### Day33

```jsx
() => <div style={{ width: 400 }}><KavanotGrid sefira="הוֹד שֶׁבְּהוֹד" ana="נ" psalmWord="אֱלֹהִים" /></div>
```

### SeventhDay

```jsx
() => <div style={{ width: 400 }}><KavanotGrid sefira="מַלְכוּת שֶׁבְּחֶסֶד" ana={'אב"ג ית"ץ'} psalmWord="סֶלָה" /></div>
```
