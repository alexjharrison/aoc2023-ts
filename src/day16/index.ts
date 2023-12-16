import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"
import { range, sum } from "../utils/utils.js"

class Supergrid<T extends string> extends Grid<T> {
  constructor(lines: T[][]) {
    super(lines)
  }
}

const parseInput = (rawInput: string) =>
  new Supergrid(rawInput
    .split('\n')
    .map(line => line.split('')))

function go(grid: Supergrid<string>, direction: "down" | 'up' | 'right' | 'left', startPos?: Point<string>, cache = new Set<string>()) {


  let nextPoint: Point<string> | null
  if (!startPos) {
    nextPoint = grid.points[0][0]
  } else if (direction === 'up') {
    nextPoint = grid.getAbove(startPos)
  } else if (direction === 'down') {
    nextPoint = grid.getBelow(startPos)
  } else if (direction === 'left') {
    nextPoint = grid.getLeft(startPos)
  } else {
    nextPoint = grid.getRight(startPos)
  }

  if (nextPoint === null) return

  if (startPos) {
    const key = JSON.stringify({ x: startPos?.x, y: startPos?.y, direction })

    if (cache.has(key)) return
    cache.add(key)
  }


  nextPoint.wasVisited = true
  const { val } = nextPoint

  // Continue
  if (val === '.' ||
    (['left', 'right'].includes(direction) && val === '-') ||
    (['up', 'down'].includes(direction) && val === '|')
  ) {
    go(grid, direction, nextPoint, cache)
  }
  // Split up & down
  else if (val === '|' && ['right', 'left'].includes(direction)) {
    go(grid, 'up', nextPoint, cache)
    go(grid, 'down', nextPoint, cache)
  }
  // Split left & right
  else if (val === '-' && ['up', 'down'].includes(direction)) {
    go(grid, 'left', nextPoint, cache)
    go(grid, 'right', nextPoint, cache)
  } else if (
    (val === '/' && direction === 'right') ||
    (val === '\\' && direction === 'left')
  ) {
    go(grid, 'up', nextPoint, cache)
  } else if (
    (val === '/' && direction === 'left') ||
    (val === '\\' && direction === 'right')
  ) {
    go(grid, 'down', nextPoint, cache)
  } else if (
    (val === '/' && direction === 'down') ||
    (val === '\\' && direction === 'up')
  ) {
    go(grid, 'left', nextPoint, cache)
  } else if (
    (val === '/' && direction === 'up') ||
    (val === '\\' && direction === 'down')
  ) {
    go(grid, 'right', nextPoint, cache)
  }
}


const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  go(grid, "right")
  return sum(grid.pointsList().map(pt => Number(pt.wasVisited)))
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  let max = 0
  for (const i of range(grid.points[0].length)) {
    go(grid, 'down', grid.points[0][i])
    max = Math.max(max, sum(grid.pointsList().map(pt => Number(pt.wasVisited))))
    grid.pointsList().forEach(pt => pt.wasVisited = false)

    go(grid, 'up', grid.points[grid.points.length - 1][i])
    max = Math.max(max, sum(grid.pointsList().map(pt => Number(pt.wasVisited))))
    grid.pointsList().forEach(pt => pt.wasVisited = false)
  }
  for (const i of range(grid.points.length)) {
    go(grid, 'right', grid.points[i][0])
    max = Math.max(max, sum(grid.pointsList().map(pt => Number(pt.wasVisited))))
    grid.pointsList().forEach(pt => pt.wasVisited = false)

    go(grid, 'left', grid.points[i][grid.points[0].length - 1])
    max = Math.max(max, sum(grid.pointsList().map(pt => Number(pt.wasVisited))))
    grid.pointsList().forEach(pt => pt.wasVisited = false)
  }
  return max
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   .|...\\....
      //   |.-.\\.....
      //   .....|-...
      //   ........|.
      //   ..........
      //   .........\\
      //   ..../.\\\\..
      //   .-.-/..|..
      //   .|....-|.\\
      //   ..//.|....
      //   `,
      //   expected: 46,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        .|...\\....
        |.-.\\.....
        .....|-...
        ........|.
        ..........
        .........\\
        ..../.\\\\..
        .-.-/..|..
        .|....-|.\\
        ..//.|....
        `,
        expected: 46,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
