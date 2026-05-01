import type { CSSProperties } from 'react'
import type { PickerLabels } from '../labels'
import type { TriggerRenderProps } from '../render-props'
import type { PickerTheme } from '../theme'
import { injectSpinnerStyle } from './spinner-style'

injectSpinnerStyle()

type PickerTriggerProps = {
	label: string
	value: string | null
	placeholder: string
	isLoading: boolean
	isDisabled: boolean
	disabledHint?: string
	hasError: boolean
	fallbackValue: string
	theme: PickerTheme
	labels: PickerLabels
	testID?: string | undefined
	id?: string | undefined
	renderTrigger?: ((props: TriggerRenderProps) => React.ReactNode) | undefined
	onFallbackChange: (text: string) => void
	onPress: () => void
	style?: CSSProperties
	className?: string | undefined
}

export function PickerTrigger({
	label,
	value,
	placeholder,
	isLoading,
	isDisabled,
	disabledHint,
	hasError,
	fallbackValue,
	theme,
	labels,
	testID,
	id,
	renderTrigger,
	onFallbackChange,
	onPress,
	style,
	className,
}: PickerTriggerProps) {
	if (renderTrigger) {
		return (
			<>
				{renderTrigger({
					label,
					displayValue: value,
					placeholder,
					isLoading,
					isDisabled,
					hasError,
					onPress,
				})}
			</>
		)
	}

	const containerStyle: CSSProperties = {
		display: 'flex',
		flexDirection: 'column',
		gap: 6,
		...style,
	}

	const labelStyle: CSSProperties = {
		fontSize: 13,
		fontWeight: 500,
		color: theme.labelColor,
	}

	const inputBaseStyle: CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 40,
		borderRadius: 8,
		border: `1px solid ${isDisabled ? theme.disabledBorderColor : theme.borderColor}`,
		backgroundColor: isDisabled ? theme.disabledBackground : theme.triggerBackground,
		paddingInline: 12,
		fontSize: 14,
		cursor: isDisabled ? 'default' : 'pointer',
		width: '100%',
		boxSizing: 'border-box',
		outline: 'none',
		fontFamily: 'inherit',
		transition: 'border-color 0.15s, background-color 0.15s',
	}

	const triggerAccessibilityLabel = isLoading
		? labels.loadingLabel(label)
		: value
			? labels.selectedValueLabel(label, value)
			: placeholder

	return (
		<div style={containerStyle} className={className}>
			<label htmlFor={id} style={labelStyle}>
				{label}
			</label>

			{/* Visually hidden live region for screen reader announcements */}
			{(isLoading || hasError) && (
				<span
					aria-live="polite"
					style={{
						position: 'absolute',
						width: 1,
						height: 1,
						overflow: 'hidden',
						clip: 'rect(0,0,0,0)',
						whiteSpace: 'nowrap',
					}}
				>
					{isLoading ? labels.loadingLabel(label) : labels.errorLabel(label)}
				</span>
			)}

			{hasError ? (
				<input
					id={id}
					style={{ ...inputBaseStyle, cursor: 'text' }}
					type="text"
					value={fallbackValue}
					onChange={(e) => onFallbackChange(e.target.value)}
					placeholder={labels.fallbackPlaceholder(label)}
					aria-label={labels.fallbackInputLabel(label)}
					aria-description={labels.fallbackInputHint(label)}
					autoCapitalize="words"
					data-testid={testID ? `${testID}-fallback-input` : undefined}
				/>
			) : (
				<button
					id={id}
					type="button"
					style={inputBaseStyle}
					onClick={onPress}
					disabled={isDisabled || isLoading}
					aria-label={triggerAccessibilityLabel}
					aria-haspopup="listbox"
					aria-expanded={false}
					title={isDisabled ? disabledHint : labels.openPickerHint(label)}
					data-testid={testID ? `${testID}-trigger` : undefined}
				>
					<span
						style={{
							flex: 1,
							textAlign: 'left',
							color: value ? theme.valueTextColor : theme.placeholderColor,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						}}
					>
						{value ?? placeholder}
					</span>

					{isLoading ? (
						<span
							style={{
								width: 14,
								height: 14,
								borderRadius: '50%',
								border: `2px solid ${theme.loadingColor}`,
								borderTopColor: 'transparent',
								display: 'inline-block',
								animation: 'spin 0.7s linear infinite',
								flexShrink: 0,
							}}
							aria-hidden
						/>
					) : (
						<span
							style={{
								color: isDisabled ? theme.chevronDisabledColor : theme.chevronColor,
								fontSize: 12,
								flexShrink: 0,
								marginLeft: 4,
							}}
							aria-hidden
						>
							▾
						</span>
					)}
				</button>
			)}
		</div>
	)
}
