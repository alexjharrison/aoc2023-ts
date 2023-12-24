import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"
import { range } from "../utils/utils.js"
import { Infinigrid } from "../utils/infinigrid.js"

const parseInput = (rawInput: string) =>
  // new Grid(rawInput.split("\n").map(line => line.split("")))
  new Infinigrid(rawInput.split("\n").map(line => line.split("")))

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  const start = grid.pointsList().find(pt => pt.val === "S")!
  const steps = 64
  let walkers = new Set([start])
  for (const _ of range(steps)) {
    let newWalkers = new Set<Point<string>>()
    for (const walker of walkers) {
      const neighbors = grid.getAdjacentNeighbors(walker)
      for (const neighbor of neighbors) {
        if (neighbor?.val === ".") {
          newWalkers.add(neighbor)
        }
      }
    }
    walkers = newWalkers
  }
  return walkers.size + 1
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  const start = grid.pointsList().find(pt => pt.val === "S")!
  const steps = 16733044
  let walkers = new Set([start])
  for (const _ of range(steps)) {
    if (_ % 1000 === 0) console.log({ step: _ })
    let newWalkers = new Set<Point<string>>()
    for (const walker of walkers) {
      const neighbors = grid.getAdjacentNeighbors(walker)
      for (const neighbor of neighbors) {
        if (neighbor?.val === ".") {
          newWalkers.add(neighbor)
        }
      }
    }
    walkers = newWalkers
  }
  return walkers.size + 1
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   ...........
      //   .....###.#.
      //   .###.##..#.
      //   ..#.#...#..
      //   ....#.#....
      //   .##..S####.
      //   .##..#...#.
      //   .......##..
      //   .##.#.####.
      //   .##..##.##.
      //   ...........
      //   `,
      //   expected: 16,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `
      //   ...........
      //   .....###.#.
      //   .###.##..#.
      //   ..#.#...#..
      //   ....#.#....
      //   .##..S####.
      //   .##..#...#.
      //   .......##..
      //   .##.#.####.
      //   .##..##.##.
      //   ...........
      //   `,
      //   expected: 16,
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
