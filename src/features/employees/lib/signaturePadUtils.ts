export function isSignaturePadFilled(dataUrl: string | null | undefined): boolean {
  return Boolean(dataUrl && dataUrl.length > 100)
}
