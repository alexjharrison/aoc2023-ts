import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid } from "../utils/grid.js"
import { areArrsEq, range } from "../utils/utils.js"

const parseInput = (rawInput: string) => rawInput.split("\n")

function scoreGrid(grid: Grid<string>): number {
  return grid.points.reduce(
    (sum, line, i) =>
      sum +
      line.filter(char => char.val === "O").length * (grid.points.length - i),
    0,
  )
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  const grid = new Grid(lines.map(line => line.split("")))
  for (const tile of grid.pointsList()) {
    let current = tile
    let above = grid.getAbove(tile)
    while (above?.val === "." && current.val === "O") {
      current.val = "."
      above.val = "O"
      current = above
      above = grid.getAbove(above)
    }
  }
  return scoreGrid(grid)
}

function fallToRight(line: string) {
  let prev = ""
  let current = line
  while (prev !== current) {
    prev = current
    current = current.replaceAll("O.", ".O")
  }
  return current
}

function rotateRight(grid: string[]) {
  const newGrid: string[] = []
  for (let [rowIdxStr, row] of Object.entries(grid)) {
    const rowIdx = +rowIdxStr
    let newLine = ""
    for (let i = 0; i < row.length; i++) {
      newLine += grid[grid.length - 1 - i][rowIdx]
    }
    newGrid.push(newLine)
  }
  return newGrid
}

function getGridSum(grid: string[]) {
  return grid.reduce(
    (sum, line, i) =>
      sum +
      line.split("").filter(char => char === "O").length * (grid.length - i),
    0,
  )
}

function isRepeating(scores: number[], repeatsRequired: number) {
  for (let i = 5; i < scores.length / 2; i++) {
    let passed = true
    let repeats = 0
    for (let num of range(repeatsRequired)) {
      const arr1 = scores.slice(i * num, i * (num + 1))
      const arr2 = scores.slice(i * (num + 1), i * (num + 2))
      if (!areArrsEq(arr1, arr2)) {
        passed = false
        continue
      }
      repeats++
    }
    if (passed && repeats > repeatsRequired) return i
  }
  return 0
}

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  const rotateCache = new Map<string, string>()
  const lineCache = new Map<string, string>()

  let grid = lines
  // const loops = 1000000000
  const loops = 100
  const values: number[] = []
  let end: number
  for (let i = 0; i < loops; i++) {
    let start = getGridSum(grid)

    // check cache here

    for (let _ = 0; _ < 4; _++) {
      const joined = grid.join(",")
      const rotated = rotateCache.get(joined)
      if (rotated) {
        grid = rotated.split(",")
      } else {
        grid = rotateRight(grid)
        rotateCache.set(joined, grid.join(","))
      }
      for (let i = 0; i < grid.length; i++) {
        const line = grid[i]
        let output = lineCache.get(line)
        if (output) {
          grid[i] = output
        } else {
          grid[i] = fallToRight(line)
          lineCache.set(line, grid[i])
        }
      }
    }
    end = getGridSum(grid)

    // save to cache here
    values.unshift(end)
    console.log(isRepeating(values, 2))
  }

  return end!
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   O....#....
      //   O.OO#....#
      //   .....##...
      //   OO.#O....O
      //   .O.....O#.
      //   O.#..O.#.#
      //   ..O..#O..O
      //   .......O..
      //   #....###..
      //   #OO..#....
      //   `,
      //   expected: 136,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        O....#....
        O.OO#....#
        .....##...
        OO.#O....O
        .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....
        `,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
