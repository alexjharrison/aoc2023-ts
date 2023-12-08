import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const grid = new Grid(lines.map((line) => line.split("")))
  grid.draw()
  return grid
}

const part1 = (rawInput: string) => {
  const seenCoords = new Set<Point<string>>()
  const nums: number[] = []
  const grid = parseInput(rawInput)
  grid
    .pointsList()
    .filter((pt) => !pt.isNumber() && !pt.isEmpty())
    .forEach((pt) => {
      const neighbors = grid.getAllNeighbors(pt)
      for (const neighbor of neighbors) {
        if (!neighbor || seenCoords.has(neighbor)) continue
        const { number, points } = grid.getNumber(neighbor)
        for (const point of points) seenCoords.add(point)
        if (number !== null) nums.push(number)
      }
    })

  return nums.reduce((sum, num) => sum + num, 0)
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  const seenCoords = new Set<Point<string>>()
  const nums: number[] = []
  grid
    .pointsList()
    .filter((pt) => pt.val === "*")
    .forEach((pt) => {
      const neighbors = grid.getAllNeighbors(pt)
      const neighborNums: number[] = []
      for (const neighbor of neighbors) {
        if (!neighbor || seenCoords.has(neighbor)) continue
        const { number, points } = grid.getNumber(neighbor)
        for (const point of points) seenCoords.add(point)
        if (number !== null) neighborNums.push(number)
      }
      if (neighborNums.length === 2)
        nums.push(neighborNums[0] * neighborNums[1])
    })

  return nums.reduce((sum, num) => sum + num, 0)
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
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
