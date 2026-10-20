Panel from @omer/ds. Use via `window.OmerDS.Panel` (bundle loaded from `components/bundle.js`). Wrap the tree in `<OmerRoot>` (full provider chain in the system's README.md — components read theme/i18n from that context).

## Props

```ts
interface PanelProps {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### WithPrayer

```jsx
() => (
  <div style={{ width: 400 }}>
    <Panel>
      <Siddur>
        <PrayerSection title="ברכה" variant="blessing">בָּרוּךְ אַתָּה יְיָ אֱלֹהֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל סְפִירַת הָעֹמֶר.</PrayerSection>
      </Siddur>
    </Panel>
  </div>
)
```
