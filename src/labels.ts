export type PickerLabels = {
	countryLabel: string
	stateLabel: string
	cityLabel: string
	countryTitle: string
	stateTitle: string
	cityTitle: string
	countryPlaceholder: string
	statePlaceholder: string
	cityPlaceholder: string
	stateDisabledPlaceholder: string
	cityDisabledPlaceholder: string
	stateNotApplicable: string
	cityNotApplicable: string
	stateDisabledHint: string
	cityDisabledHint: string
	loadingLabel: (label: string) => string
	errorLabel: (label: string) => string
	searchPlaceholder: string
	noResults: string
	fallbackPlaceholder: (label: string) => string
	closeDropdown: (title: string) => string
	searchAccessibilityLabel: (title: string) => string
	openPickerHint: (label: string) => string
	selectedValueLabel: (label: string, value: string) => string
	fallbackInputLabel: (label: string) => string
	fallbackInputHint: (label: string) => string
}

export const DEFAULT_LABELS: PickerLabels = {
	countryLabel: 'Country',
	stateLabel: 'State / Province',
	cityLabel: 'City',
	countryTitle: 'Select Country',
	stateTitle: 'Select State / Province',
	cityTitle: 'Select City',
	countryPlaceholder: 'Select country',
	statePlaceholder: 'Select state',
	cityPlaceholder: 'Select city',
	stateDisabledPlaceholder: 'Select a country first',
	cityDisabledPlaceholder: 'Select a state first',
	stateNotApplicable: 'Not applicable',
	cityNotApplicable: 'Not applicable',
	stateDisabledHint: 'Select a country to enable state picker',
	cityDisabledHint: 'Select a state to enable city picker',
	loadingLabel: (label) => `Loading ${label.toLocaleLowerCase()} options`,
	errorLabel: (label) =>
		`Failed to load ${label.toLocaleLowerCase()} options. Enter manually.`,
	searchPlaceholder: 'Search…',
	noResults: 'No results',
	fallbackPlaceholder: (label) => `Enter ${label.toLocaleLowerCase()} manually`,
	closeDropdown: (title) => `Close ${title}`,
	searchAccessibilityLabel: (title) => `Search ${title}`,
	openPickerHint: (label) => `Opens ${label.toLocaleLowerCase()} picker`,
	selectedValueLabel: (label, value) => `${label}: ${value}`,
	fallbackInputLabel: (label) => `${label} text input`,
	fallbackInputHint: (label) =>
		`Type a ${label.toLocaleLowerCase()} name manually`,
}

export function resolveLabels(override?: Partial<PickerLabels>): PickerLabels {
	if (!override) return DEFAULT_LABELS
	return { ...DEFAULT_LABELS, ...override }
}
