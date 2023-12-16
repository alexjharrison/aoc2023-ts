import "@total-typescript/ts-reset"
import run from "aocrunner"
import { enumerate, sum } from "../utils/utils.js"

const parseInput = (rawInput: string) => rawInput.split(",")

const getScore = (str: string) => {
  let current = 0
  for (const letter of str) {
    const ascii = letter.charCodeAt(0)
    current += ascii
    current *= 17
    current %= 256
  }
  return current
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return sum(input.map(getScore))
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const hashmap: Record<string, [string, number][]> = {}
  for (const word of input) {
    // add
    if (word.includes("=")) {
      const [key, valStr] = word.split("=")
      const val = Number(valStr)
      const box = getScore(key)
      if (!hashmap[box]) {
        hashmap[box] = [[key, val]]
        continue
      }
      const idx = hashmap[box].findIndex(([str]) => str === key)
      if (idx === -1) hashmap[box].push([key, val])
      else hashmap[box][idx][1] = val
    }
    // remove
    else {
      const key = word.slice(0, -1)
      const box = getScore(key)
      if (hashmap[box]) {
        hashmap[box] = hashmap[box].filter(([str]) => key !== str)
      }
    }
  }
  let sum = 0
  Object.entries(hashmap).forEach(([boxStr, lensList]) => {
    const box = Number(boxStr)
    for (const [slot, [_name, focusPower]] of enumerate(lensList)) {
      sum += (box + 1) * (slot + 1) * focusPower
    }
  })
  return sum
}

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
