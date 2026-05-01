import { useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useCities } from '../hooks/use-cities'
import { usePickerTheme } from '../hooks/use-picker-theme'
import { useClickOutside } from '../hooks/use-click-outside'
import type { PickerLabels } from '../labels'
import { resolveLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { City } from '../types'
import { PickerDropdown } from './picker-dropdown'
import { PickerTrigger } from './picker-trigger'

type CityPickerProps = PickerRenderProps & {
	countryCode: string | null | undefined
	stateCode: string | null | undefined
	value: City | null
	onChange: (city: City) => void
	notApplicable?: boolean | undefined
	placeholder?: string | undefined
	theme?: Partial<PickerTheme> | undefined
	labels?: Partial<PickerLabels> | undefined
	testID?: string | undefined
	style?: CSSProperties | undefined
	className?: string | undefined
}

export function CityPicker({
	countryCode,
	stateCode,
	value,
	onChange,
	notApplicable = false,
	placeholder,
	theme: themeOverride,
	labels: labelsOverride,
	testID,
	renderTrigger,
	renderItem,
	renderSearch,
	renderEmpty,
	style,
	className,
}: CityPickerProps) {
	const [open, setOpen] = useState(false)
	const [fallback, setFallback] = useState('')
	const { data, isLoading, error } = useCities(countryCode, stateCode)
	const resolvedTheme = usePickerTheme(themeOverride)
	const resolvedLabels = resolveLabels(labelsOverride)
	const triggerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const id = useId()

	const isDisabled = !countryCode || !stateCode
	const isNotApplicable =
		notApplicable || (!isLoading && !error && !!stateCode && data.length === 0)

	useClickOutside([triggerRef, dropdownRef], () => setOpen(false), open)

	const items = useMemo(
		() =>
			data.map((c) => ({
				label: c.name,
				value: c.name,
			})),
		[data]
	)

	function handleSelect(name: string) {
		const city = data.find((c) => c.name === name)
		if (city) onChange(city)
	}

	return (
		<div ref={triggerRef} style={style} className={className}>
			<PickerTrigger
				id={id}
				label={resolvedLabels.cityLabel}
				value={isNotApplicable ? null : (value?.name ?? null)}
				placeholder={
					isNotApplicable
						? resolvedLabels.cityNotApplicable
						: isDisabled
							? resolvedLabels.cityDisabledPlaceholder
							: (placeholder ?? resolvedLabels.cityPlaceholder)
				}
				isLoading={isLoading}
				isDisabled={isDisabled || isNotApplicable}
				disabledHint={resolvedLabels.cityDisabledHint}
				hasError={!!error}
				fallbackValue={fallback}
				theme={resolvedTheme}
				labels={resolvedLabels}
				testID={testID}
				renderTrigger={renderTrigger}
				onFallbackChange={setFallback}
				onPress={() => setOpen(true)}
			/>

			<PickerDropdown
				open={open}
				anchorRef={triggerRef}
				items={items}
				title={resolvedLabels.cityTitle}
				theme={resolvedTheme}
				labels={resolvedLabels}
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
