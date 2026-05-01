import { useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { resolveLabels } from '../labels'
import type { PickerLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { Country } from '../types'
import { useCountries } from '../hooks/use-countries'
import { usePickerTheme } from '../hooks/use-picker-theme'
import { useClickOutside } from '../hooks/use-click-outside'
import { PickerDropdown } from './picker-dropdown'
import { PickerTrigger } from './picker-trigger'

type CountryPickerProps = PickerRenderProps & {
	value: Country | null
	onChange: (country: Country) => void
	theme?: Partial<PickerTheme> | undefined
	labels?: Partial<PickerLabels> | undefined
	testID?: string | undefined
	style?: CSSProperties | undefined
	className?: string | undefined
}

export function CountryPicker({
	value,
	onChange,
	theme: themeOverride,
	labels: labelsOverride,
	testID,
	renderTrigger,
	renderItem,
	renderSearch,
	renderEmpty,
	style,
	className,
}: CountryPickerProps) {
	const [open, setOpen] = useState(false)
	const [fallbackValue, setFallbackValue] = useState('')
	const theme = usePickerTheme(themeOverride)
	const labels = resolveLabels(labelsOverride)
	const { data: countries, isLoading, error } = useCountries()
	const triggerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const id = useId()

	useClickOutside([triggerRef, dropdownRef], () => setOpen(false), open)

	const items = countries.map((c) => ({
		label: `${c.flag} ${c.name}`,
		subLabel: c.isoCode,
		value: c.isoCode,
	}))

	function handleSelect(isoCode: string) {
		const country = countries.find((c) => c.isoCode === isoCode)
		if (country) onChange(country)
	}

	return (
		<div ref={triggerRef} style={style} className={className}>
			<PickerTrigger
				id={id}
				label={labels.countryLabel}
				value={value ? `${value.flag} ${value.name}` : null}
				placeholder={labels.countryPlaceholder}
				isLoading={isLoading}
				isDisabled={false}
				hasError={!!error}
				fallbackValue={fallbackValue}
				theme={theme}
				labels={labels}
				testID={testID}
				renderTrigger={renderTrigger}
				onFallbackChange={setFallbackValue}
				onPress={() => setOpen(true)}
			/>
			<PickerDropdown
				open={open}
				anchorRef={triggerRef}
				items={items}
				title={labels.countryTitle}
				theme={theme}
				labels={labels}
				testID={testID}
				renderItem={renderItem}
				renderSearch={renderSearch}
				renderEmpty={renderEmpty}
				onSelect={handleSelect}
				onClose={() => setOpen(false)}
			/>
		</div>
	)
}
