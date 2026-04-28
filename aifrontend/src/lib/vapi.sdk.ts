import Vapi from '@vapi-ai/web'

let vapiSingleton: Vapi | null = null

export const getVapiClient = (): Vapi | null => {
  if (typeof window === 'undefined') return null

  const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN

  if (!token) {
    console.warn('Missing VAPI token')
    return null
  }

  if (!vapiSingleton) {
    vapiSingleton = new Vapi(token)
  }

  return vapiSingleton
}