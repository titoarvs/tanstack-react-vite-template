const IP_LOOKUP_URL = "https://api.ipify.org?format=json"
const LOOKUP_TIMEOUT_MS = 4000

export async function getClientIpAddress(): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS)
    const response = await fetch(IP_LOOKUP_URL, { signal: controller.signal })
    window.clearTimeout(timeout)
    if (!response.ok) return "unavailable"
    const data = (await response.json()) as { ip?: string }
    return data.ip?.trim() || "unavailable"
  } catch {
    return "unavailable"
  }
}
