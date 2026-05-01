import type { ReactNode } from 'react'

export type TriggerRenderProps = {
	label: string
	displayValue: string | null
	placeholder: string
	isLoading: boolean
	isDisabled: boolean
	hasError: boolean
	onPress: () => void
}

export type ItemRenderProps = {
	label: string
	value: string
	onSelect: () => void
}

export type SearchRenderProps = {
	value: string
	placeholder: string
	onChange: (value: string) => void
}

export type EmptyRenderProps = {
	query: string
}

export type PickerRenderProps = {
	renderTrigger?: ((props: TriggerRenderProps) => ReactNode) | undefined
	renderItem?: ((props: ItemRenderProps) => ReactNode) | undefined
	renderSearch?: ((props: SearchRenderProps) => ReactNode) | undefined
	renderEmpty?: ((props: EmptyRenderProps) => ReactNode) | undefined
}
