# 🌍 react-country-state-city-picker

A fully featured, accessible, and customizable **country → state → city** cascade picker for React.

[![npm version](https://img.shields.io/npm/v/react-country-state-city-picker?style=flat-square&color=6366f1)](https://www.npmjs.com/package/react-country-state-city-picker)
[![npm downloads](https://img.shields.io/npm/dm/react-country-state-city-picker?style=flat-square&color=6366f1)](https://www.npmjs.com/package/react-country-state-city-picker)
[![license](https://img.shields.io/npm/l/react-country-state-city-picker?style=flat-square&color=22c55e)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61dafb?style=flat-square&logo=react)](https://react.dev/)

---

## ✨ Features

| Feature                      | Details                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 🌐 **Live geodata**          | Countries, states, and cities via [geocoded.me](https://api.geocoded.me) API |
| 🌑 **Dark & light mode**     | Auto-detects system color scheme; override with a single prop                |
| ♿ **Accessibility-first**   | ARIA roles, live regions, dynamic labels, keyboard navigation, focus traps   |
| 🌍 **Internationalization**  | 28 customizable label strings — ship in any language                         |
| 🎨 **Fully themeable**       | 22 design tokens covering every pixel of the UI                              |
| 🔌 **Render props**          | Replace trigger, row, search, or empty state with your own UI                |
| 🪝 **Headless hooks**        | `useCountries`, `useStates`, `useCities` — build your own UI from scratch    |
| 🔗 **Cascade or standalone** | Use all three pickers together or any single one in isolation                |
| ⚡ **Smart caching**         | LRU cache with in-flight deduplication — no duplicate network requests       |
| 🔁 **Retry logic**           | 3 attempts with exponential backoff on network failures                      |
| 🧪 **Testable**              | `testID` on every interactive element                                        |
| 💙 **TypeScript-first**      | Strict types for all components, hooks, themes, and labels                   |
| 📦 **Zero dependencies**     | No third-party UI library required                                           |

---

## 📸 Preview

| Light          | Dark           | Custom Theme   |
| -------------- | -------------- | -------------- |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

---

## 📦 Installation

```sh
# bun (recommended)
bun add react-country-state-city-picker

# npm
npm install react-country-state-city-picker

# yarn
yarn add react-country-state-city-picker
```

Requires React 18+. No additional setup needed.

---

## 🚀 Quick Start

### Composite picker (all three levels)

```tsx
import { CountryStateCityPicker } from 'react-country-state-city-picker'
import type { PickerSelection } from 'react-country-state-city-picker'

export default function AddressForm() {
  const handleSelect = (selection: PickerSelection) => {
    console.log(selection.country?.name) // "India"
    console.log(selection.state?.name)   // "Maharashtra"
    console.log(selection.city?.name)    // "Mumbai"
  }

  return <CountryStateCityPicker onSelect={handleSelect} />
}
```

### Individual pickers

```tsx
import { useState } from 'react'
import {
  CountryPicker,
  StatePicker,
  CityPicker,
} from 'react-country-state-city-picker'
import type { Country, State, City } from 'react-country-state-city-picker'

export default function AddressForm() {
  const [country, setCountry] = useState<Country | null>(null)
  const [state, setState] = useState<State | null>(null)
  const [city, setCity] = useState<City | null>(null)

  return (
    <>
      <CountryPicker value={country} onChange={setCountry} />
      <StatePicker
        value={state}
        onChange={setState}
        countryCode={country?.isoCode}
      />
      <CityPicker
        value={city}
        onChange={setCity}
        countryCode={country?.isoCode}
        stateCode={state?.isoCode}
      />
    </>
  )
}
```

---

## 📖 API Reference

### `<CountryStateCityPicker>`

All-in-one component that manages the full country → state → city cascade.

| Prop            | Type                                       | Default          | Description                                              |
| --------------- | ------------------------------------------ | ---------------- | -------------------------------------------------------- |
| `onSelect`      | `(selection: PickerSelection) => void`     | —                | Called whenever any level changes                        |
| `defaultValue`  | `Partial<PickerSelection>`                 | —                | Pre-selected values on mount                             |
| `theme`         | `Partial<PickerTheme>`                     | auto             | Override any design token (falls back to system theme)   |
| `labels`        | `Partial<PickerLabels>`                    | `DEFAULT_LABELS` | Override any label string                                |
| `testID`        | `string`                                   | —                | Base test ID — suffixed per field (e.g. `base-country`)  |
| `style`         | `CSSProperties`                            | —                | Outer container style                                    |
| `className`     | `string`                                   | —                | Outer container class name                               |
| `renderTrigger` | `(props: TriggerRenderProps) => ReactNode` | —                | Replace the trigger button UI                            |
| `renderItem`    | `(props: ItemRenderProps) => ReactNode`    | —                | Replace each dropdown row                                |
| `renderSearch`  | `(props: SearchRenderProps) => ReactNode`  | —                | Replace the search input                                 |
| `renderEmpty`   | `(props: EmptyRenderProps) => ReactNode`   | —                | Replace the empty state                                  |

---

### `<CountryPicker>`

| Prop            | Type                                       | Default          | Description                        |
| --------------- | ------------------------------------------ | ---------------- | ---------------------------------- |
| `value`         | `Country \| null`                          | —                | Currently selected country         |
| `onChange`      | `(country: Country) => void`               | —                | Called when user selects a country |
| `theme`         | `Partial<PickerTheme>`                     | auto             | Design tokens                      |
| `labels`        | `Partial<PickerLabels>`                    | `DEFAULT_LABELS` | Label strings                      |
| `testID`        | `string`                                   | —                | Test identifier                    |
| `style`         | `CSSProperties`                            | —                | Container style                    |
| `className`     | `string`                                   | —                | Container class name               |
| `renderTrigger` | `(props: TriggerRenderProps) => ReactNode` | —                | Custom trigger UI                  |
| `renderItem`    | `(props: ItemRenderProps) => ReactNode`    | —                | Custom row UI                      |
| `renderSearch`  | `(props: SearchRenderProps) => ReactNode`  | —                | Custom search UI                   |
| `renderEmpty`   | `(props: EmptyRenderProps) => ReactNode`   | —                | Custom empty state                 |

---

### `<StatePicker>`

All props from `CountryPicker` plus:

| Prop          | Type                          | Default | Description                                    |
| ------------- | ----------------------------- | ------- | ---------------------------------------------- |
| `countryCode` | `string \| null \| undefined` | —       | ISO2 country code to load states for           |
| `onNoStates`  | `() => void`                  | —       | Called when the selected country has no states |
| `placeholder` | `string`                      | —       | Overrides the default placeholder text         |

---

### `<CityPicker>`

All props from `StatePicker` plus:

| Prop            | Type                          | Default | Description                             |
| --------------- | ----------------------------- | ------- | --------------------------------------- |
| `stateCode`     | `string \| null \| undefined` | —       | ISO2 state code to load cities for      |
| `notApplicable` | `boolean`                     | `false` | Force the field into N/A state manually |

---

## 🌑 Dark & Light Mode

### Auto-detect system theme

The library reads `prefers-color-scheme` automatically. No configuration needed — it switches between `DEFAULT_THEME` (light) and `DARK_THEME` (dark) on its own.

### Manual override

```tsx
import { DARK_THEME, DEFAULT_THEME } from 'react-country-state-city-picker'

// Force dark
<CountryStateCityPicker theme={DARK_THEME} onSelect={handleSelect} />

// Force light
<CountryStateCityPicker theme={DEFAULT_THEME} onSelect={handleSelect} />
```

### Custom brand theme

Override only the tokens you need — everything else falls back to the system default:

```tsx
const brandTheme = {
  dropdownBackground: '#1e1b4b',
  titleColor: '#a5b4fc',
  searchBackground: '#312e81',
  rowTextColor: '#e0e7ff',
  labelColor: '#a5b4fc',
  borderColor: '#4f46e5',
  triggerBackground: '#1e1b4b',
  valueTextColor: '#e0e7ff',
  chevronColor: '#6366f1',
}

<CountryStateCityPicker theme={brandTheme} onSelect={handleSelect} />
```

<details>
<summary>All 22 theme tokens</summary>

| Token                    | Description                         |
| ------------------------ | ----------------------------------- |
| `dropdownBackground`     | Dropdown panel background           |
| `titleColor`             | Dropdown title text                 |
| `searchBackground`       | Search input background             |
| `searchTextColor`        | Search input text                   |
| `searchPlaceholderColor` | Search placeholder text             |
| `rowTextColor`           | Primary text in list rows           |
| `rowSubTextColor`        | Secondary text in list rows         |
| `rowHoverBackground`     | Row hover state                     |
| `separatorColor`         | Row separator line                  |
| `emptyTextColor`         | Empty state text                    |
| `labelColor`             | Field label above trigger           |
| `borderColor`            | Trigger border                      |
| `triggerBackground`      | Trigger background                  |
| `disabledBackground`     | Disabled trigger background         |
| `disabledBorderColor`    | Disabled trigger border             |
| `hoverBackground`        | Trigger hover state                 |
| `focusRingColor`         | Keyboard focus ring                 |
| `valueTextColor`         | Selected value text                 |
| `placeholderColor`       | Trigger placeholder text            |
| `chevronColor`           | Chevron icon                        |
| `chevronDisabledColor`   | Chevron when disabled               |
| `loadingColor`           | Loading spinner                     |

</details>

---

## 🌍 Internationalization

Override any label string to ship in any language:

```tsx
import { CountryStateCityPicker } from 'react-country-state-city-picker'

const spanishLabels = {
  countryLabel: 'País',
  stateLabel: 'Estado / Provincia',
  cityLabel: 'Ciudad',
  countryTitle: 'Selecciona un país',
  stateTitle: 'Selecciona un estado',
  cityTitle: 'Selecciona una ciudad',
  searchPlaceholder: 'Buscar…',
  noResults: 'Sin resultados',
  countryPlaceholder: 'Seleccionar país',
  statePlaceholder: 'Seleccionar estado',
  cityPlaceholder: 'Seleccionar ciudad',
}

<CountryStateCityPicker labels={spanishLabels} onSelect={handleSelect} />
```

<details>
<summary>All label keys</summary>

```ts
type PickerLabels = {
  // Field labels
  countryLabel: string
  stateLabel: string
  cityLabel: string

  // Dropdown titles
  countryTitle: string
  stateTitle: string
  cityTitle: string

  // Placeholder text
  countryPlaceholder: string
  statePlaceholder: string
  cityPlaceholder: string

  // Disabled-state placeholders
  stateDisabledPlaceholder: string
  cityDisabledPlaceholder: string

  // N/A state
  stateNotApplicable: string
  cityNotApplicable: string

  // Disabled hints (shown as tooltip)
  stateDisabledHint: string
  cityDisabledHint: string

  // Search
  searchPlaceholder: string
  noResults: string

  // Loading & error (called with runtime values)
  loadingLabel: (field: string) => string
  errorLabel: (field: string) => string
  fallbackPlaceholder: (field: string) => string

  // Accessibility
  closeDropdown: (title: string) => string
  searchAccessibilityLabel: (title: string) => string
  openPickerHint: (label: string) => string
  selectedValueLabel: (label: string, value: string) => string
  fallbackInputLabel: (label: string) => string
  fallbackInputHint: (label: string) => string
}
```

</details>

---

## 🔌 Render Props

Take complete control of any part of the UI while keeping the library's data-fetching, caching, and cascade logic intact.

### Custom trigger

```tsx
<CountryPicker
  value={country}
  onChange={setCountry}
  renderTrigger={({ label, displayValue, placeholder, isLoading, isDisabled, onPress }) => (
    <button onClick={onPress} disabled={isDisabled} className="my-trigger">
      <span>{label}</span>
      <span>{displayValue ?? placeholder}</span>
      {isLoading && <span className="spinner" />}
    </button>
  )}
/>
```

### Custom row

```tsx
<CountryPicker
  value={country}
  onChange={setCountry}
  renderItem={({ label, value, onSelect }) => (
    <button onClick={onSelect} className="my-row">
      {label}
      <span className="iso-code">{value}</span>
    </button>
  )}
/>
```

### Custom search

```tsx
<CountryPicker
  value={country}
  onChange={setCountry}
  renderSearch={({ value, placeholder, onChange }) => (
    <div className="my-search">
      <span>🔍</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )}
/>
```

### Custom empty state

```tsx
<CountryPicker
  value={country}
  onChange={setCountry}
  renderEmpty={({ query }) => (
    <p>No results for "{query}"</p>
  )}
/>
```

All four render props work on `CountryPicker`, `StatePicker`, `CityPicker`, and `CountryStateCityPicker`.

---

## 🪝 Hooks

Use the headless hooks to build entirely custom UIs with the library's caching layer.

### `useCountries()`

```tsx
import { useCountries } from 'react-country-state-city-picker'

const { data, isLoading, error } = useCountries()
// data: Country[]  — [ { name, isoCode, flag, currency }, … ]
```

### `useStates(countryCode)`

```tsx
import { useStates } from 'react-country-state-city-picker'

const { data, isLoading, error } = useStates('IN')
// data: State[]  — [ { name, isoCode, countryCode }, … ]
```

### `useCities(countryCode, stateCode)`

```tsx
import { useCities } from 'react-country-state-city-picker'

const { data, isLoading, error } = useCities('IN', 'MH')
// data: City[]  — [ { name, stateCode, countryCode }, … ]
```

### `usePresetSelection(input)`

Resolve backend-stored strings (country name or ISO2 code) back into typed objects on load.

```tsx
import { usePresetSelection } from 'react-country-state-city-picker'

// Backend gives you raw strings — resolve them to full objects
const { selection, isLoading } = usePresetSelection({
  country: 'IN',         // ISO2 code or display name
  state: 'Maharashtra',  // name or ISO2 code
  city: 'Mumbai',
})

<CountryStateCityPicker defaultValue={selection} onSelect={handleSelect} />
```

### `usePickerTheme(override?)`

```tsx
import { usePickerTheme } from 'react-country-state-city-picker'

// Resolves to DARK_THEME or DEFAULT_THEME based on prefers-color-scheme,
// then merges any override tokens on top
const theme = usePickerTheme({ borderColor: '#6366f1' })
```

---

## ♿ Accessibility

The picker is built accessibility-first:

- **ARIA roles** — triggers are `role="button"` with `aria-haspopup="listbox"`, dropdowns use `role="listbox"`
- **Live regions** — loading and error states announced via `aria-live="polite"`
- **Dynamic labels** — screen readers hear `"Country: India"` (not just `"Button"`)
- **Disabled hints** — when a field is locked, screen readers explain why (e.g. `"Select a country first"`)
- **Keyboard navigation** — full keyboard support in dropdowns (Arrow keys, Enter, Escape)
- **Focus management** — search input auto-focuses when dropdown opens; focus returns to trigger on close
- **Hidden decorative elements** — chevron and spinner are `aria-hidden`

All labels and hints are customizable via the `labels` prop so you can localize them too.

---

## 🧪 Testing

Every interactive element exposes a `testID`. Pass a base string and each sub-element gets a suffixed ID:

```tsx
<CountryStateCityPicker testID="address" onSelect={handleSelect} />

// Resolves to:
// address-country   — country trigger button
// address-state     — state trigger button
// address-city      — city trigger button
```

```tsx
// Example with Testing Library
const { getByTestId } = render(<AddressForm />)

await userEvent.click(getByTestId('address-country-trigger'))
// … interact with the dropdown
```

---

## 🏗️ Architecture

```
CountryStateCityPicker
├── CountryPicker
│   ├── useCountries()          ← LRU cache, retry, dedup
│   └── PickerDropdown
│       ├── search input        ← debounced, accent-normalized
│       └── listbox rows
├── StatePicker
│   └── useStates(countryCode)
└── CityPicker
    └── useCities(countryCode, stateCode)
```

**Caching strategy**:

| Resource  | Cache size | ~Memory |
| --------- | ---------- | ------- |
| Countries | 1 entry    | ~10 KB  |
| States    | 20 entries | ~30 KB  |
| Cities    | 10 entries | ~300 KB |

In-flight deduplication prevents duplicate API calls when multiple components mount simultaneously.

---

## 📐 TypeScript

All types are exported from the package root:

```ts
import type {
  Country,
  State,
  City,
  PickerSelection,
  PickerTheme,
  PickerLabels,
  TriggerRenderProps,
  ItemRenderProps,
  SearchRenderProps,
  EmptyRenderProps,
  PickerRenderProps,
} from 'react-country-state-city-picker'
```

```ts
type Country = {
  name: string
  isoCode: string
  flag: string      // emoji flag
  currency?: string
}

type State = {
  name: string
  isoCode: string
  countryCode: string
}

type City = {
  name: string
  stateCode: string
  countryCode: string
}

type PickerSelection = {
  country: Country | null
  state: State | null
  city: City | null
}
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and how to send a pull request.

---

## 📄 License

[MIT](LICENSE) © Shan Kulkarni
