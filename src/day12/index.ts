import "@total-typescript/ts-reset"
import run from "aocrunner"
import { range, sum } from "../utils/utils.js"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const sequences = lines.map(line => line.split(" ")[0])
  const sizesList = lines.map(line => line.split(" ")[1].split(",").map(Number))

  return sequences.map((seq, i) => ({ sequence: seq, sizes: sizesList[i] }))
}

function countSequences(sequence: string, sizes: number[], count = 0): number {
  const idx = sequence.indexOf("?")

  if (idx === -1) {
    const sizesSorted = sizes
    const sequenceSorted = sequence
      .split(".")
      .filter(arr => arr.length > 0)
      .map(chars => chars.length)
    const matches =
      JSON.stringify(sizesSorted) === JSON.stringify(sequenceSorted)

    return matches ? 1 : 0
  }

  const dot = sequence.slice(0, idx) + "." + sequence.slice(idx + 1)
  const hash = sequence.slice(0, idx) + "#" + sequence.slice(idx + 1)
  return (
    count +
    countSequences(dot, sizes, count) +
    countSequences(hash, sizes, count)
  )
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  return sum(
    lines.map(({ sequence, sizes }) => countSequences(sequence, sizes)),
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  input.forEach(({ sequence, sizes }, i) => {
    const originalSequence = sequence
    const originalSizes = [...sizes]
    for (const _ of range(4)) {
      input[i].sequence += "?" + originalSequence
      input[i].sizes.push(...originalSizes)
    }
  })
  // console.dir({ input }, { depth: null })
  return sum(
    input.map(({ sequence, sizes }) => countSequences(sequence, sizes)),
  )
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   .??..??...?##. 1,1,3
      //   `,
      //   expected: 4,
      // },
      // {
      //   input: `
      //   ???.### 1,1,3
      //   .??..??...?##. 1,1,3
      //   ?#?#?#?#?#?#?#? 1,3,1,6
      //   ????.#...#... 4,1,1
      //   ????.######..#####. 1,6,5
      //   ?###???????? 3,2,1
      //   `,
      //   expected: 21,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ???.### 1,1,3
        `,
        expected: 1,
      },
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1
        `,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
