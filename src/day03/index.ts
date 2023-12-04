import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split('/n')
  const grid = new Grid(lines.map(line => line
    .split('')
    .map(char =>
      char === '.' ? "" : char)
  ))
  grid.draw()
  return grid
}

const part1 = (rawInput: string) => {
  const seenCoords = new Set<Point<string>>()
  const grid = parseInput(rawInput)
  return
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        `,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
