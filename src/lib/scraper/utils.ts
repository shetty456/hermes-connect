export function findByAriaLabel(
  root: Document | Element,
  label: string,
  partial = false,
): Element | null {
  const selector = partial
    ? `[aria-label*="${label}" i]`
    : `[aria-label="${label}" i]`
  return root.querySelector(selector)
}

export function getTextContent(el: Element | null): string | null {
  if (!el) return null
  const text = el.textContent?.trim()
  return text || null
}

export function findButtonByText(root: Document, text: string): HTMLButtonElement | null {
  const buttons = root.querySelectorAll<HTMLButtonElement>('button')
  for (const btn of buttons) {
    const btnText = btn.textContent?.trim() ?? ''
    if (btnText.toLowerCase().includes(text.toLowerCase())) return btn
  }
  return null
}

export function findByVisibleText(
  root: Document,
  pattern: RegExp,
  selector = '*',
): Element | null {
  const elements = root.querySelectorAll(selector)
  for (const el of elements) {
    if (el.children.length === 0 && pattern.test(el.textContent?.trim() ?? '')) return el
  }
  return null
}

export function safeQuery<T extends Element>(
  root: Document | Element,
  selector: string,
): T | null {
  try {
    return root.querySelector<T>(selector)
  } catch {
    return null
  }
}
