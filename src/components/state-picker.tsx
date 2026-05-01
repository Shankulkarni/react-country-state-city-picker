import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { useStates } from '../hooks/use-states'
import { usePickerTheme } from '../hooks/use-picker-theme'
import { useClickOutside } from '../hooks/use-click-outside'
import type { PickerLabels } from '../labels'
import { resolveLabels } from '../labels'
import type { PickerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import type { State } from '../types'
import { PickerDropdown } from './picker-dropdown'
import { PickerTrigger } from './picker-trigger'

type StatePickerProps = PickerRenderProps & {
	countryCode: string | null | undefined
	value: State | null
	onChange: (state: State) => void
	onNoStates?: (() => void) | undefined
	placeholder?: string | undefined
	theme?: Partial<PickerTheme> | undefined
	labels?: Partial<PickerLabels> | undefined
	testID?: string | undefined
	style?: CSSProperties | undefined
	className?: string | undefined
}

export function StatePicker({
	countryCode,
	value,
	onChange,
	onNoStates,
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
}: StatePickerProps) {
	const [open, setOpen] = useState(false)
	const [fallback, setFallback] = useState('')
	const { data, isLoading, error } = useStates(countryCode)
	const resolvedTheme = usePickerTheme(themeOverride)
	const resolvedLabels = resolveLabels(labelsOverride)
	const triggerRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const id = useId()

	const isDisabled = !countryCode
	const isNotApplicable =
		!isLoading && !error && !!countryCode && data.length === 0

	const onNoStatesRef = useRef(onNoStates)
	useEffect(() => {
		onNoStatesRef.current = onNoStates
	})

	useEffect(() => {
		if (isNotApplicable) onNoStatesRef.current?.()
	}, [isNotApplicable])

	useClickOutside([triggerRef, dropdownRef], () => setOpen(false), open)

	const items = useMemo(
		() =>
			data.map((s) => ({
				label: s.name,
				value: s.isoCode,
			})),
		[data]
	)

	function handleSelect(isoCode: string) {
		const state = data.find((s) => s.isoCode === isoCode)
		if (state) onChange(state)
	}

	return (
		<div ref={triggerRef} style={style} className={className}>
			<PickerTrigger
				id={id}
				label={resolvedLabels.stateLabel}
				value={isNotApplicable ? null : (value?.name ?? null)}
				placeholder={
					isNotApplicable
						? resolvedLabels.stateNotApplicable
						: isDisabled
							? resolvedLabels.stateDisabledPlaceholder
							: (placeholder ?? resolvedLabels.statePlaceholder)
				}
				isLoading={isLoading}
				isDisabled={isDisabled || isNotApplicable}
				disabledHint={resolvedLabels.stateDisabledHint}
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
				title={resolvedLabels.stateTitle}
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
