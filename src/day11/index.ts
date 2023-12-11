import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid } from "../utils/grid.js"

const parseInput = (rawInput: string) => rawInput.split("\n")

function getEmptyRowsAndCols(input: string[]) {
  const rows = input
    .map((row, i) => (row.split("").every(char => char === ".") ? i : null))
    .filter(Boolean)
  const cols = input.reduce<number[]>((acc, _, i, all) => {
    if (all.every(row => row[i] === ".")) acc.push(i)
    return acc
  }, [])
  return { rows, cols }
}

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput)
  const { rows, cols } = getEmptyRowsAndCols(input)
  const grid = new Grid(input.map(line => line.split("")))
  const points = grid.pointsList().filter(pt => pt.val !== ".")
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const pt1 = points[i]
      const pt2 = points[j]
      const distance = Math.abs(pt1.x - pt2.x) + Math.abs(pt1.y - pt2.y)
      const yBounds = [pt1.y, pt2.y].sort((a, b) => a - b)
      const xBounds = [pt1.x, pt2.x].sort((a, b) => a - b)
      const expandedRows =
        rows.filter(idx => idx > yBounds[0] && idx < yBounds[1]).length * 1
      const expandedCols =
        cols.filter(idx => idx > xBounds[0] && idx < xBounds[1]).length * 1
      sum += expandedRows + expandedCols + distance
    }
  }
  return sum
}

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput)
  const { rows, cols } = getEmptyRowsAndCols(input)
  const grid = new Grid(input.map(line => line.split("")))
  const points = grid.pointsList().filter(pt => pt.val !== ".")
  let sum = 0
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const pt1 = points[i]
      const pt2 = points[j]
      const distance = Math.abs(pt1.x - pt2.x) + Math.abs(pt1.y - pt2.y)
      const yBounds = [pt1.y, pt2.y].sort((a, b) => a - b)
      const xBounds = [pt1.x, pt2.x].sort((a, b) => a - b)
      const expandedRows =
        rows.filter(idx => idx > yBounds[0] && idx < yBounds[1]).length *
        999_999
      const expandedCols =
        cols.filter(idx => idx > xBounds[0] && idx < xBounds[1]).length *
        999_999
      sum += expandedRows + expandedCols + distance
    }
  }
  return sum
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   ...#......
      //   .......#..
      //   #.........
      //   ..........
      //   ......#...
      //   .#........
      //   .........#
      //   ..........
      //   .......#..
      //   #...#.....
      //   `,
      //   expected: 374,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....
        `,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
