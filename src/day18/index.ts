import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"
import { enumerate, range, sum } from "../utils/utils.js"

type Payload = {
  color: string
  char: string
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const points: Point<Payload>[] = []
  let x = 0
  let y = 0
  const bounds = {
    x: [0, 0],
    y: [0, 0],
  }
  let prevDir = "S"
  for (const [lineIdx, line] of enumerate(lines)) {
    const [dir, steps, color] = line.split(" ")
    for (const i of range(+steps)) {
      let char = "#"
      // let char = "-"
      // if (["U", "D"].includes(dir)) char = "|"
      // if (i === 0) {
      //   if (prevDir === "U" && dir === "R") char = "F"
      //   if (prevDir === "U" && dir === "L") char = "7"
      //   if (prevDir === "D" && dir === "L") char = "J"
      //   if (prevDir === "D" && dir === "R") char = "L"
      // }

      const point = new Point(x, y, { color: color.slice(1, -1), char })
      points.push(point)

      bounds.x = [Math.min(x, bounds.x[0]), Math.max(x, bounds.x[1])]
      bounds.y = [Math.min(y, bounds.y[0]), Math.max(y, bounds.y[1])]

      if (dir === "L") x--
      else if (dir === "R") x++
      else if (dir === "U") y--
      else if (dir === "D") y++
      prevDir = dir
    }
  }
  const grid = new Grid(
    range(bounds.y[1] - bounds.y[0] + 1 + 2).map(rowIdx =>
      range(bounds.x[1] - bounds.x[0] + 1 + 2).map(
        colIdx =>
          points.find(
            pt =>
              pt.x === colIdx + bounds.x[0] - 1 &&
              pt.y === rowIdx + bounds.y[0] - 1,
          )?.val || { color: "null", char: "." },
      ),
    ),
  )
  return { points, bounds, grid }
}

function flood(pt: Point<Payload>, grid: Grid<Payload>) {
  if (pt.wasVisited) return
  pt.wasVisited = true
  const neighbors = grid.getAdjacentNeighbors(pt)
  for (const neighbor of neighbors) {
    console.log(`${pt.x}-${pt.y}`)
    if (neighbor && neighbor.val.char !== "#") {
      if (!neighbor.wasVisited) {
        flood(neighbor, grid)
      }
    }
  }
}

const part1 = (rawInput: string) => {
  const { points, bounds, grid } = parseInput(rawInput)
  const start = grid.points[0][0]
  flood(start, grid)
  return sum(grid.pointsList().map(pt => +!pt.wasVisited))
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
        R 6 (#70c710)
        D 5 (#0dc571)
        L 2 (#5713f0)
        D 2 (#d2c081)
        R 2 (#59c680)
        D 2 (#411b91)
        L 5 (#8ceee2)
        U 2 (#caa173)
        L 1 (#1b58a2)
        U 2 (#caa171)
        R 2 (#7807d2)
        U 3 (#a77fa3)
        L 2 (#015232)
        U 2 (#7a21e3)
        `,
        expected: 62,
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
  onlyTests: false,
})
