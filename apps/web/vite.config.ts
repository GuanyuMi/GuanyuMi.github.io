import { parseResumeData } from '@portfolio/resume-schema'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const loadPublishedResume = async (url: string, key: string) => {
  const endpoint = new URL('/rest/v1/resume_published', url)
  endpoint.searchParams.set('select', 'content')
  endpoint.searchParams.set('locale', 'eq.en')
  endpoint.searchParams.set('limit', '1')

  const response = await fetch(endpoint, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    signal: AbortSignal.timeout(15_000),
  })

  if (!response.ok) {
    throw new Error(`Could not load the published resume (HTTP ${response.status})`)
  }

  const rows: unknown = await response.json()
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0] !== 'object' || rows[0] === null || !('content' in rows[0])) {
    throw new Error('No published English resume was found')
  }

  const result = parseResumeData(rows[0].content)
  if (!result.success) {
    throw new Error(`Published resume validation failed: ${result.error.message}`)
  }

  return result.data
}

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required to build the public site')
  }

  const resume = await loadPublishedResume(url, key)

  return {
    define: {
      __RESUME_SNAPSHOT__: JSON.stringify(resume),
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
