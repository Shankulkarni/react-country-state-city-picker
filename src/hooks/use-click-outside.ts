import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useClickOutside(
	refs: RefObject<HTMLElement | null>[],
	handler: () => void,
	enabled: boolean
): void {
	useEffect(() => {
		if (!enabled) return
		function onPointerDown(e: PointerEvent) {
			const target = e.target as Node
			if (refs.every((ref) => !ref.current?.contains(target))) {
				handler()
			}
		}
		document.addEventListener('pointerdown', onPointerDown)
		return () => document.removeEventListener('pointerdown', onPointerDown)
	}, [refs, handler, enabled])
}
