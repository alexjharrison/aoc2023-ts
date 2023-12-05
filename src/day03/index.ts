import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("/n")
  const grid = new Grid(lines.map((line) => line.split("")))
  grid.draw()
  return grid
}

const part1 = (rawInput: string) => {
  const seenCoords = new Set<Point>()
  const nums: number[] = []
  const grid = parseInput(rawInput)
  for (const row of grid.points) {
    for (const pt of row) {
      if (!pt.isEmpty() && !pt.isNumber()) {
        ;[
          grid.getAbove,
          grid.getTopRight,
          grid.getRight,
          grid.getBottomRight,
          grid.getBelow,
          grid.getBottomLeft,
          grid.getLeft,
          grid.getTopLeft,
        ].forEach((func) => {
          const neighbor = func(pt)
          if (!neighbor) return
          const result = grid.getNumber(neighbor)
          if (!result) return
          const { number, points } = result
          points.forEach((pt) => seenCoords.add(pt))
          if (points.some((pt) => seenCoords.has(pt))) return
          nums.push(number)
        })
      }
    }
  }
  console.log({ nums })
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
