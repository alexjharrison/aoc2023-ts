import "@total-typescript/ts-reset"
import run from "aocrunner"
import { sum } from "../utils/utils.js"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map(line => line.split(" ").filter(Boolean).map(Number))

function getLastValues(line: number[], lastValues: number[] = []): number[] {
  const nextLine: number[] = []
  for (let i = 0; i < line.length - 1; i++) {
    nextLine.push(line[i + 1] - line[i])
  }
  lastValues.push(line[line.length - 1])
  if (nextLine.every(val => val === 0)) return lastValues
  return getLastValues(nextLine, lastValues)
}

function getPreviousValues(
  line: number[],
  firstValues: number[] = [],
): number[] {
  const nextLine: number[] = []
  for (let i = 0; i < line.length - 1; i++) {
    nextLine.push(line[i + 1] - line[i])
  }
  firstValues.push(line[0])
  if (nextLine.every(val => val === 0)) return firstValues
  return getPreviousValues(nextLine, firstValues)
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  const lastValues = lines.map(val => sum(getLastValues(val)))
  return sum(lastValues)
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  const firstValues = lines.map(line =>
    getPreviousValues(line)
      .toReversed()
      .reduce((diff, current) => current - diff, 0),
  )
  return sum(firstValues)
}

run({
  part1: {
    tests: [
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45  
        `,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        10 13 16 21 30 45
        `,
        expected: 5,
      },
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45
        `,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
