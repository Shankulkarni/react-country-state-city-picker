import { useEffect, useState } from 'react'
import { resolveTheme } from '../theme'
import type { PickerTheme } from '../theme'

export function usePickerTheme(override?: Partial<PickerTheme>): PickerTheme {
	const [isDark, setIsDark] = useState(() =>
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-color-scheme: dark)').matches
			: false
	)

	useEffect(() => {
		if (typeof window === 'undefined') return
		const mq = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
		mq.addEventListener('change', handler)
		return () => mq.removeEventListener('change', handler)
	}, [])

	return resolveTheme(isDark ? 'dark' : 'light', override)
}
