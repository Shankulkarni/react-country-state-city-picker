import { createPortal } from 'react-dom'
import {
	useEffect,
	useRef,
	useState,
	useMemo,
	useId,
	type CSSProperties,
} from 'react'
import type { PickerLabels } from '../labels'
import type {
	EmptyRenderProps,
	ItemRenderProps,
	SearchRenderProps,
} from '../render-props'
import type { PickerTheme } from '../theme'
import { useDebounce } from '../hooks/use-debounce'
import { matchesSearch } from '../utils/search'

type Item = {
	label: string
	subLabel?: string
	value: string
}

type PickerDropdownProps = {
	open: boolean
	anchorRef: React.RefObject<HTMLElement | null>
	items: Item[]
	title: string
	theme: PickerTheme
	labels: PickerLabels
	testID?: string | undefined
	renderItem?: ((props: ItemRenderProps) => React.ReactNode) | undefined
	renderSearch?: ((props: SearchRenderProps) => React.ReactNode) | undefined
	renderEmpty?: ((props: EmptyRenderProps) => React.ReactNode) | undefined
	onSelect: (value: string) => void
	onClose: () => void
}

export function PickerDropdown({
	open,
	anchorRef,
	items,
	title,
	theme,
	labels,
	testID,
	renderItem,
	renderSearch,
	renderEmpty,
	onSelect,
	onClose,
}: PickerDropdownProps) {
	const [search, setSearch] = useState('')
	const [activeIndex, setActiveIndex] = useState(0)
	const [position, setPosition] = useState<{
		top: number
		left: number
		width: number
		flipUp: boolean
	}>({
		top: 0,
		left: 0,
		width: 240,
		flipUp: false,
	})

	const searchRef = useRef<HTMLInputElement>(null)
	const listRef = useRef<HTMLUListElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const listboxId = useId()

	const debouncedSearch = useDebounce(search, 150)
	const filtered = useMemo(
		() => items.filter((item) => matchesSearch(item.label, debouncedSearch)),
		[items, debouncedSearch]
	)

	// Reset state on open
	useEffect(() => {
		if (open) {
			setSearch('')
			setActiveIndex(0)
			// Position after mount
			requestAnimationFrame(() => {
				if (!anchorRef.current) return
				const rect = anchorRef.current.getBoundingClientRect()
				const panelHeight = 360
				const spaceBelow = window.innerHeight - rect.bottom
				const flipUp = spaceBelow < panelHeight && rect.top > panelHeight
				setPosition({
					top: flipUp
						? rect.top + window.scrollY - panelHeight - 4
						: rect.bottom + window.scrollY + 4,
					left: rect.left + window.scrollX,
					width: rect.width,
					flipUp,
				})
				requestAnimationFrame(() => searchRef.current?.focus())
			})
		}
	}, [open, anchorRef])

	// Reset active index when filtered list changes
	useEffect(() => {
		setActiveIndex(0)
	}, [debouncedSearch])

	// Scroll active item into view
	useEffect(() => {
		const list = listRef.current
		if (!list) return
		const active = list.children[activeIndex] as HTMLElement | undefined
		active?.scrollIntoView({ block: 'nearest' })
	}, [activeIndex])

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault()
			setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
		} else if (e.key === 'ArrowUp') {
			e.preventDefault()
			setActiveIndex((i) => Math.max(i - 1, 0))
		} else if (e.key === 'Enter') {
			e.preventDefault()
			const item = filtered[activeIndex]
			if (item) handleSelect(item.value)
		} else if (e.key === 'Escape') {
			e.preventDefault()
			onClose()
		}
	}

	function handleSelect(value: string) {
		onSelect(value)
		onClose()
	}

	if (!open) return null

	const PANEL_HEIGHT = 360

	const panelStyle: CSSProperties = {
		position: 'absolute',
		top: position.top,
		left: position.left,
		width: position.width,
		maxHeight: PANEL_HEIGHT,
		zIndex: 9999,
		backgroundColor: theme.dropdownBackground,
		borderRadius: 12,
		boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
		border: `1px solid ${theme.separatorColor}`,
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
	}

	const titleStyle: CSSProperties = {
		fontSize: 14,
		fontWeight: 600,
		color: theme.titleColor,
		padding: '12px 16px 8px',
		borderBottom: `1px solid ${theme.separatorColor}`,
		flexShrink: 0,
	}

	const searchStyle: CSSProperties = {
		margin: '8px 12px',
		padding: '7px 10px',
		borderRadius: 8,
		border: 'none',
		outline: 'none',
		backgroundColor: theme.searchBackground,
		color: theme.searchTextColor,
		fontSize: 14,
		flexShrink: 0,
	}

	const listStyle: CSSProperties = {
		overflowY: 'auto',
		flex: 1,
		listStyle: 'none',
		margin: 0,
		padding: 0,
	}

	const emptyStyle: CSSProperties = {
		textAlign: 'center',
		padding: '24px 16px',
		color: theme.emptyTextColor,
		fontSize: 14,
	}

	const content = (
		<div
			ref={panelRef}
			style={panelStyle}
			role="dialog"
			aria-label={title}
			onKeyDown={handleKeyDown}
			data-testid={testID ? `${testID}-dropdown` : undefined}
		>
			<div style={titleStyle}>{title}</div>

			{renderSearch ? (
				renderSearch({
					value: search,
					placeholder: labels.searchPlaceholder,
					onChange: setSearch,
				})
			) : (
				<input
					ref={searchRef}
					style={searchStyle}
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder={labels.searchPlaceholder}
					aria-label={labels.searchAccessibilityLabel(title)}
					autoComplete="off"
					data-testid={testID ? `${testID}-search` : undefined}
				/>
			)}

			<ul
				ref={listRef}
				style={listStyle}
				role="listbox"
				id={listboxId}
				aria-label={title}
			>
				{filtered.length === 0 ? (
					renderEmpty ? (
						renderEmpty({ query: search })
					) : (
						<li style={emptyStyle} role="status" aria-live="polite">
							{labels.noResults}
						</li>
					)
				) : (
					filtered.map((item, index) => {
						const isActive = index === activeIndex
						const rowStyle: CSSProperties = {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							padding: '10px 16px',
							cursor: 'pointer',
							backgroundColor: isActive
								? theme.rowHoverBackground
								: 'transparent',
							borderBottom:
								index < filtered.length - 1
									? `1px solid ${theme.separatorColor}`
									: 'none',
						}
						return renderItem ? (
							<li key={item.value} role="option" aria-selected={isActive}>
								{renderItem({
									label: item.label,
									value: item.value,
									onSelect: () => handleSelect(item.value),
								})}
							</li>
						) : (
							<li
								key={item.value}
								role="option"
								aria-selected={isActive}
								style={rowStyle}
								onPointerEnter={() => setActiveIndex(index)}
								onPointerDown={(e) => {
									e.preventDefault()
									handleSelect(item.value)
								}}
								data-testid={
									testID ? `${testID}-option-${item.value}` : undefined
								}
							>
								<span
									style={{
										fontSize: 14,
										color: theme.rowTextColor,
										flex: 1,
									}}
								>
									{item.label}
								</span>
								{item.subLabel ? (
									<span
										style={{
											fontSize: 12,
											color: theme.rowSubTextColor,
											marginLeft: 8,
										}}
									>
										{item.subLabel}
									</span>
								) : null}
							</li>
						)
					})
				)}
			</ul>
		</div>
	)

	return createPortal(content, document.body)
}
