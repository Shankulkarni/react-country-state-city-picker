import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { PickerLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { City, Country, PickerSelection, State } from '../types'
import { CityPicker } from './city-picker'
import { CountryPicker } from './country-picker'
import { StatePicker } from './state-picker'

type CountryStateCityPickerProps = PickerRenderProps & {
	onSelect: (selection: Partial<PickerSelection>) => void
	defaultValue?: Partial<PickerSelection> | undefined
	theme?: Partial<PickerTheme> | undefined
	labels?: Partial<PickerLabels> | undefined
	testID?: string | undefined
	style?: CSSProperties | undefined
	className?: string | undefined
}

export function CountryStateCityPicker({
	onSelect,
	defaultValue,
	theme,
	labels,
	testID,
	renderTrigger,
	renderItem,
	renderSearch,
	renderEmpty,
	style,
	className,
}: CountryStateCityPickerProps) {
	const [country, setCountry] = useState<Country | null>(
		defaultValue?.country ?? null
	)
	const [state, setState] = useState<State | null>(defaultValue?.state ?? null)
	const [city, setCity] = useState<City | null>(defaultValue?.city ?? null)
	const [countryHasNoStates, setCountryHasNoStates] = useState(false)

	function handleCountryChange(selected: Country) {
		setCountry(selected)
		setState(null)
		setCity(null)
		setCountryHasNoStates(false)
		onSelect({ country: selected, state: null, city: null })
	}

	function handleStateChange(selected: State) {
		setState(selected)
		setCity(null)
		onSelect({ country, state: selected, city: null })
	}

	function handleCityChange(selected: City) {
		setCity(selected)
		onSelect({ country, state, city: selected })
	}

	const containerStyle: CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		gap: 16,
		...style,
	}

	return (
		<div style={containerStyle} className={className}>
			<CountryPicker
				value={country}
				onChange={handleCountryChange}
				theme={theme}
				labels={labels}
				testID={testID ? `${testID}-country` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
			/>

			<StatePicker
				countryCode={country?.isoCode}
				value={state}
				onChange={handleStateChange}
				onNoStates={() => setCountryHasNoStates(true)}
				theme={theme}
				labels={labels}
				testID={testID ? `${testID}-state` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
			/>

			<CityPicker
				countryCode={country?.isoCode}
				stateCode={state?.isoCode}
				value={city}
				onChange={handleCityChange}
				notApplicable={countryHasNoStates}
				theme={theme}
				labels={labels}
				testID={testID ? `${testID}-city` : undefined}
				renderTrigger={renderTrigger}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
			/>
		</div>
	)
}
