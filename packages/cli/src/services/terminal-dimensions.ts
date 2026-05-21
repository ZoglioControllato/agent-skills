export interface TerminalSize {
  width: number
  height: number
}

export function getTerminalSize(): TerminalSize {
  return { width: process.stdout.columns || 80, height: process.stdout.rows || 24 }
}

export function shouldUseBottomPanel(): boolean {
  const { width } = getTerminalSize()
  return width < 120
}

export function canShowDetailPanel(): boolean {
  const { width, height } = getTerminalSize()
  return width >= 80 && height >= 24
}

/** How many list rows fit below fixed chrome (header, titles, footer). */
export function getVisibleListLimit(itemCount: number, chromeLines: number, minVisible = 3): number {
  const { height } = getTerminalSize()
  const available = Math.max(minVisible, height - chromeLines)
  return Math.min(itemCount, available)
}
