import { useEffect, useState } from 'react'
import { fetchCities } from '../api/geocoded'
import { cachedFetch, citiesCache } from '../cache/query-cache'
import type { City } from '../types'

type UseCitiesResult = {
	data: City[]
	isLoading: boolean
	error: Error | null
}

type InternalState = UseCitiesResult & { key: string | null }

function cacheKey(countryCode: string, stateCode: string): string {
	return `${countryCode}:${stateCode}`
}

export function useCities(
	countryCode: string | null | undefined,
	stateCode: string | null | undefined
): UseCitiesResult {
	const key =
		countryCode && stateCode ? cacheKey(countryCode, stateCode) : null

	const [state, setState] = useState<InternalState>(() => {
		if (!key) return { data: [], isLoading: false, error: null, key: null }
		const cached = citiesCache.get(key)
		return cached
			? { data: cached, isLoading: false, error: null, key }
			: { data: [], isLoading: true, error: null, key }
	})

	useEffect(() => {
		if (!key || !countryCode || !stateCode) {
			setState({ data: [], isLoading: false, error: null, key: null })
			return
		}

		if (citiesCache.has(key)) {
			const cached = citiesCache.get(key)!
			setState({ data: cached, isLoading: false, error: null, key })
			return
		}

		setState({ data: [], isLoading: true, error: null, key })

		let cancelled = false

		cachedFetch(citiesCache, key, () => fetchCities(countryCode, stateCode))
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
