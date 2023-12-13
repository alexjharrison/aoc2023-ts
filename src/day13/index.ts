import "@total-typescript/ts-reset"
import run from "aocrunner"
import { setIntersection, sum } from "../utils/utils.js"

type Grid = {
  rows: string[][]
  transposedRows: string[][]
}

const parseInput = (rawInput: string) => {
  const grids = rawInput.split("\n\n")
  const gridsContent = grids.map(grid => {
    const rows = grid.split("\n")
    let transposedRows: string[] = []
    for (let col = 0; col < rows[0].length; col++) {
      transposedRows.push("")
      for (let row = 0; row < rows.length; row++) {
        transposedRows[col] += rows[row][col]
      }
    }
    return {
      rows: rows.map(r => r.split("")),
      transposedRows: transposedRows.map(t => t.split("")),
    }
  })
  return gridsContent
}

function getSymmetryPoints(line: string[]): Set<number> {
  const points = new Set<number>()
  for (let i = 1; i < line.length; i++) {
    let step = 0
    while (true) {
      let prev = line[i - 1 - step]
      let curr = line[i + step]
      if (prev === undefined || curr === undefined) {
        points.add(i)
        break
      }
      if (prev !== curr) break
      step++
    }
  }
  return points
}

function getPartialGridScore(grid: Grid) {
  const { rows, transposedRows } = grid
  const symmetryLinesRows =
    [...setIntersection(rows.map(getSymmetryPoints))][0] || 0
  const symmetryLinesCols =
    [...setIntersection(transposedRows.map(getSymmetryPoints))][0] || 0
  return { symmetryLinesCols, symmetryLinesRows }
}

function getGridScore(grid: Grid): number {
  const { symmetryLinesCols, symmetryLinesRows } = getPartialGridScore(grid)
  return symmetryLinesRows + 100 * symmetryLinesCols
}

const part1 = (rawInput: string) => {
  const grids = parseInput(rawInput)
  return sum(grids.map(getGridScore))
}

const part2 = (rawInput: string) => {
  const swapMap = { ".": "#", "#": "." }
  const grids = parseInput(rawInput)
  const gridScores = grids.map(grid => {
    let maxScore = 0
    let originalScore = getPartialGridScore(grid)
    for (let i = 0; i < grid.rows.length; i++) {
      for (let j = 0; j < grid.transposedRows.length; j++) {
        const rows = [...grid.rows.map(row => [...row])]
        const transposedRows = [...grid.transposedRows.map(row => [...row])]

        rows[i][j] = swapMap[rows[i][j] as keyof typeof swapMap]
        transposedRows[j][i] =
          swapMap[transposedRows[j][i] as keyof typeof swapMap]

        let score = getPartialGridScore({ rows, transposedRows })
        if (score.symmetryLinesCols === originalScore.symmetryLinesCols)
          score.symmetryLinesCols = 0
        if (score.symmetryLinesRows === originalScore.symmetryLinesRows)
          score.symmetryLinesRows = 0

        const gridScore =
          score.symmetryLinesRows + 100 * score.symmetryLinesCols
        maxScore = Math.max(maxScore, gridScore)
      }
    }
    return maxScore
  })
  return sum(gridScores)
}

run({
  part1: {
    tests: [
      {
        input: `
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#
        
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.
        `,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          #...##..#
          #....#..#
          ..##..###
          #####.##.
          #####.##.
          ..##..###
          #....#..#

          #.##..##.
          ..#.##.#.
          ##......#
          ##......#
          ..#.##.#.
          ..##..##.
          #.#.##.#.
          `,
        expected: 400,
      },
      // {
      //   input: `
      //   .......#.####
      //   #..#.##.#####
      //   .#...#..#....
      //   #..#.###.....
      //   .##.#..##.##.
      //   #####.#..####
      //   ....######..#
      //   .#.#..#
      //   ....##.
      //   #..#..#
      //   ###....
      //   ..#####
      //   .##.##.
      //   .#..##.
      //   .#..##.
      //   .##.##.
      //   ..#####
      //   ###....
      //   #..#..#
      //   ....##.
      //   .#.#..#
      //   ####..#
      //   #.#.#..
      //   ....##.
      //   `,
      //   expected: 400,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})

// console.log("regular rows")
// grid.rows.map(row => console.log(row.join(" ")))
// console.log("modified rows")
// rows.map(row => console.log(row.join(" ")))
// console.log("regular trows")
// grid.transposedRows.map(row => console.log(row.join(" ")))
// console.log("modified trows")
// transposedRows.map(t => console.log(t.join(" ")))
// console.log({ i, j })
// rows[j][i] = swapMap[rows[j][i] as keyof typeof swapMap]
