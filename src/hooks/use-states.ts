import { useEffect, useState } from 'react'
import { fetchStates } from '../api/geocoded'
import { cachedFetch, statesCache } from '../cache/query-cache'
import type { State } from '../types'

type UseStatesResult = {
	data: State[]
	isLoading: boolean
	error: Error | null
}

type InternalState = UseStatesResult & { key: string | null }

export function useStates(
	countryCode: string | null | undefined
): UseStatesResult {
	const key = countryCode ?? null

	const [state, setState] = useState<InternalState>(() => {
		if (!key) return { data: [], isLoading: false, error: null, key: null }
		const cached = statesCache.get(key)
		return cached
			? { data: cached, isLoading: false, error: null, key }
			: { data: [], isLoading: true, error: null, key }
	})

	useEffect(() => {
		if (!key) {
			setState({ data: [], isLoading: false, error: null, key: null })
			return
		}

		if (statesCache.has(key)) {
			const cached = statesCache.get(key)!
			setState({ data: cached, isLoading: false, error: null, key })
			return
		}

		setState({ data: [], isLoading: true, error: null, key })

		let cancelled = false

		cachedFetch(statesCache, key, () => fetchStates(key))
			.then((data) => {
				if (!cancelled) setState({ data, isLoading: false, error: null, key })
			})
			.catch((err: unknown) => {
				if (!cancelled)
					setState({
						data: [],
						isLoading: false,
						error: err instanceof Error ? err : new Error(String(err)),
						key,
					})
			})

		return () => {
			cancelled = true
		}
	}, [key])

	// Derive isLoading synchronously: if the key changed but the stored
	// result is still for the previous key, report loading immediately.
	// This eliminates the false-positive render where isLoading=false
	// with empty data for a new, not-yet-fetched key.
	if (state.key !== key) {
		return { data: [], isLoading: key !== null, error: null }
	}

	return { data: state.data, isLoading: state.isLoading, error: state.error }
}
