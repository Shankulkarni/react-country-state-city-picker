import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'react-country-state-city-picker': resolve(__dirname, '../src/index.tsx'),
		},
	},
})
