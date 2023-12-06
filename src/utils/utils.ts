export const sum = (arr: number[]) => arr.reduce((sum, val) => sum + val, 0)
export const multiply = (arr: number[]) =>
  arr.reduce((sum, val) => sum * val, 1)
