import { useState } from 'react'
import {
	CountryStateCityPicker,
	CountryPicker,
	StatePicker,
	CityPicker,
	usePresetSelection,
	type PickerSelection,
	type Country,
	type State,
	type City,
	DEFAULT_THEME,
	DARK_THEME,
} from 'react-country-state-city-picker'

function JsonResult({ value }: { value: unknown }) {
	return (
		<pre style={{
			background: '#f3f4f6',
			borderRadius: 8,
			padding: '10px 14px',
			fontSize: 12,
			overflow: 'auto',
			marginTop: 8,
		}}>
			{JSON.stringify(value, null, 2)}
		</pre>
	)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section style={{
			background: '#fff',
			borderRadius: 12,
			padding: 20,
			boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
		}}>
			<h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: '#111827' }}>{title}</h2>
			{children}
		</section>
	)
}

function PresetDemo() {
	const { selection, isLoading } = usePresetSelection({
		country: 'IN',
		state: 'MH',
		city: 'Mumbai',
	})
	const [result, setResult] = useState<Partial<PickerSelection>>({})

	if (isLoading) return <p>Loading preset…</p>

	return (
		<>
			<CountryStateCityPicker defaultValue={selection} onSelect={setResult} theme={DEFAULT_THEME} />
			<JsonResult value={result} />
		</>
	)
}

export default function App() {
	const [selection, setSelection] = useState<Partial<PickerSelection>>({ country: null, state: null, city: null })
	const [darkSelection, setDarkSelection] = useState<Partial<PickerSelection>>({ country: null, state: null, city: null })
	const [country, setCountry] = useState<Country | null>(null)
	const [state, setState] = useState<State | null>(null)
	const [city, setCity] = useState<City | null>(null)

	return (
		<div style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
			<h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#111827' }}>
				react-country-state-city-picker
			</h1>
			<p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Component examples</p>

			<Section title="1. Composite picker (light theme)">
				<CountryStateCityPicker onSelect={setSelection} theme={DEFAULT_THEME} />
				<JsonResult value={selection} />
			</Section>

			<Section title="2. Individual controlled pickers">
				<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<CountryPicker value={country} onChange={(c) => { setCountry(c); setState(null); setCity(null) }} theme={DEFAULT_THEME} />
					<StatePicker countryCode={country?.isoCode} value={state} onChange={(s) => { setState(s); setCity(null) }} theme={DEFAULT_THEME} />
					<CityPicker countryCode={country?.isoCode} stateCode={state?.isoCode} value={city} onChange={setCity} theme={DEFAULT_THEME} />
				</div>
				<JsonResult value={{ country, state, city }} />
			</Section>

			<Section title="3. Dark theme">
				<div style={{ background: '#111827', borderRadius: 10, padding: '16px 14px' }}>
					<CountryStateCityPicker onSelect={setDarkSelection} theme={DARK_THEME} />
				</div>
				<JsonResult value={darkSelection} />
			</Section>

			<Section title="4. Preset selection (India → Maharashtra → Mumbai)">
				<PresetDemo />
			</Section>
		</div>
	)
}
