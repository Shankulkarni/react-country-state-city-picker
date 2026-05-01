// Injects the @keyframes spin rule once into the document head.
// Called lazily so it only fires in browser environments.
let injected = false

export function injectSpinnerStyle(): void {
	if (injected || typeof document === 'undefined') return
	injected = true
	const style = document.createElement('style')
	style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }'
	document.head.appendChild(style)
}
