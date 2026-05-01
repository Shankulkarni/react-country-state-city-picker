import type { City, Country, State } from '../types'
import { isoToFlag } from '../utils/flag'

const BASE_URL = 'https://api.geocoded.me'

type ApiEnvelope<T> = {
	data: T[]
	meta: {
		total: number
		limit: number
		offset: number
		hasMore: boolean
		cursor: string | null
	}
}

async function withRetry<T>(
	fn: () => Promise<T>,
	maxAttempts = 3,
	baseDelayMs = 300
): Promise<T> {
	let lastError: unknown
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			return await fn()
		} catch (err) {
			lastError = err
			if (attempt < maxAttempts - 1) {
				await new Promise<void>((resolve) =>
					setTimeout(resolve, baseDelayMs * 2 ** attempt)
				)
			}
		}
	}
	throw lastError
}

async function apiFetch<T>(url: string): Promise<T> {
	const res = await fetch(url)
	if (!res.ok) {
		throw new Error(`geocoded.me ${res.status} ${res.statusText}`)
	}
	return res.json() as Promise<T>
}

const PAGE_LIMIT = 500

async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
	const results: T[] = []
	let offset = 0

	while (true) {
		const sep = baseUrl.includes('?') ? '&' : '?'
		const url = `${baseUrl}${sep}limit=${PAGE_LIMIT}&offset=${offset}`
		const envelope = await withRetry(() => apiFetch<ApiEnvelope<T>>(url))
		results.push(...envelope.data)
		if (!envelope.meta.hasMore) break
		offset += PAGE_LIMIT
	}

	return results
}

type RawCountry = {
	name: string
	iso2: string
	emoji: string
	currency: string
}

type RawState = {
	name: string
	iso2: string
	countryCode: string
}

type RawCity = {
	name: string
	stateCode: string
	countryCode: string
}

export async function fetchCountries(): Promise<Country[]> {
	const raw = await fetchAllPages<RawCountry>(`${BASE_URL}/countries`)
	return raw.map((c) => ({
		name: c.name,
		isoCode: c.iso2,
		flag: c.emoji ?? isoToFlag(c.iso2),
		currency: c.currency,
	}))
}

export async function fetchStates(countryCode: string): Promise<State[]> {
	const raw = await fetchAllPages<RawState>(
		`${BASE_URL}/countries/${encodeURIComponent(countryCode)}/states`
	)
	return raw.map((s) => ({
		name: s.name,
		isoCode: s.iso2,
		countryCode: s.countryCode,
	}))
}

export async function fetchCities(
	countryCode: string,
	stateCode: string
): Promise<City[]> {
	const raw = await fetchAllPages<RawCity>(
		`${BASE_URL}/countries/${encodeURIComponent(countryCode)}/states/${encodeURIComponent(stateCode)}/cities`
	)
	return raw.map((c) => ({
		name: c.name,
		stateCode: c.stateCode,
		countryCode: c.countryCode,
	}))
}
