// lightweight helpers for validation checks used in Preview
export function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function isPasswordValid(v: string) {
  // example: min 8 chars and at least one number
  return v.length >= 8 && /\d/.test(v)
}
