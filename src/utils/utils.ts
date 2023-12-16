export const sum = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0)
export const multiply = (arr: number[]) =>
  arr.reduce((sum, val) => sum * val, 1)

export const gcd = (a: number, b: number): number =>
  b == 0 ? a : gcd(b, a % b)
export const lcm = (a: number, b: number) => (a / gcd(a, b)) * b
export const lcmAll = (ns: number[]) => ns.reduce(lcm, 1)
export const rng = (lo: number, hi: number) =>
  [...Array(hi - lo + 1)].map((_, i) => lo + i)

export const lcmRng = (lo: number, hi: number) => lcmAll(rng(lo, hi))

export const range = (num: number) => new Array(num).fill(null).map((_, i) => i)

export const setIntersection = <T>(sets: Set<T>[]): Set<T> => {
  const output = sets[0]
  for (const set of sets) {
    for (const val of output) {
      if (!set.has(val)) {
        output.delete(val)
      }
    }
  }
  return output
}

export const areArrsEq = <T>(arr1: T[], arr2: T[]) =>
  arr1.every(val => arr2.includes(val))

export const enumerate = <T>(arr: T[]): [number, T][] =>
  arr.map((val, i) => [i, val])
