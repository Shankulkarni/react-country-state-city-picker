export type PickerTheme = {
	// Dropdown panel
	dropdownBackground: string
	titleColor: string
	// Search input
	searchBackground: string
	searchTextColor: string
	searchPlaceholderColor: string
	// List rows
	rowTextColor: string
	rowSubTextColor: string
	rowHoverBackground: string
	separatorColor: string
	emptyTextColor: string
	// Trigger
	labelColor: string
	borderColor: string
	triggerBackground: string
	disabledBackground: string
	disabledBorderColor: string
	hoverBackground: string
	focusRingColor: string
	valueTextColor: string
	placeholderColor: string
	chevronColor: string
	chevronDisabledColor: string
	loadingColor: string
}

export const DEFAULT_THEME: PickerTheme = {
	dropdownBackground: '#ffffff',
	titleColor: '#111827',
	searchBackground: '#f3f4f6',
	searchTextColor: '#111827',
	searchPlaceholderColor: '#9ca3af',
	rowTextColor: '#111827',
	rowSubTextColor: '#6b7280',
	rowHoverBackground: '#f9fafb',
	separatorColor: '#e5e7eb',
	emptyTextColor: '#9ca3af',
	labelColor: '#374151',
	borderColor: '#d1d5db',
	triggerBackground: '#ffffff',
	disabledBackground: '#f9fafb',
	disabledBorderColor: '#e5e7eb',
	hoverBackground: '#f3f4f6',
	focusRingColor: '#6366f1',
	valueTextColor: '#111827',
	placeholderColor: '#9ca3af',
	chevronColor: '#6b7280',
	chevronDisabledColor: '#d1d5db',
	loadingColor: '#6b7280',
}

export const DARK_THEME: PickerTheme = {
	dropdownBackground: '#1c1c1e',
	titleColor: '#f2f2f7',
	searchBackground: '#2c2c2e',
	searchTextColor: '#f2f2f7',
	searchPlaceholderColor: '#636366',
	rowTextColor: '#f2f2f7',
	rowSubTextColor: '#8e8e93',
	rowHoverBackground: '#2c2c2e',
	separatorColor: '#3a3a3c',
	emptyTextColor: '#636366',
	labelColor: '#ebebf5',
	borderColor: '#3a3a3c',
	triggerBackground: '#1c1c1e',
	disabledBackground: '#141414',
	disabledBorderColor: '#2c2c2e',
	hoverBackground: '#2c2c2e',
	focusRingColor: '#818cf8',
	valueTextColor: '#f2f2f7',
	placeholderColor: '#636366',
	chevronColor: '#8e8e93',
	chevronDisabledColor: '#3a3a3c',
	loadingColor: '#8e8e93',
}

export function resolveTheme(
	colorScheme: 'dark' | 'light' | null,
	override?: Partial<PickerTheme>
): PickerTheme {
	const base = colorScheme === 'dark' ? DARK_THEME : DEFAULT_THEME
	if (!override) return base
	return { ...base, ...override }
}
