
export function evaluateDerived(fieldFormula: string, parents: Record<string, any>) {
  try {
   
    const keys = Object.keys(parents)
    const values = keys.map(k => parents[k])
    const fn = new Function(...keys, `return (${fieldFormula});`)
    return fn(...values)
  } catch (error) {
    return ''
  }
}
