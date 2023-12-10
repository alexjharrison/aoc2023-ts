import "@total-typescript/ts-reset"
import run from "aocrunner"
import { Grid, Point } from "../utils/grid.js"

type MaybePoint<T> = Point<T> | null

const convertXYMap = {
  "10": "-",
  "-10": "-",
  "01": "|",
  "0-1": "|",
  "11": "7",
  "1-1": "J",
  "-11": "F",
  "-1-1": "L",
}

class SuperGrid<T extends string> extends Grid<T> {
  public start: Point<T>
  public distance = 0
  public path = new Set<Point<T>>()
  constructor(lines: T[][]) {
    super(lines)
    this.start = this.pointsList().find(pt => pt.val === "S")!
    this.getPath()
  }
  private getConnectedNeighbors(
    pt: Point<T>,
  ): [MaybePoint<T>, MaybePoint<T>] | null {
    switch (pt.val) {
      case "|":
        return [this.getAbove(pt), this.getBelow(pt)]
      case "-":
        return [this.getLeft(pt), this.getRight(pt)]
      case "L":
        return [this.getAbove(pt), this.getRight(pt)]
      case "J":
        return [this.getAbove(pt), this.getLeft(pt)]
      case "7":
        return [this.getLeft(pt), this.getBelow(pt)]
      case "F":
        return [this.getRight(pt), this.getBelow(pt)]
      default:
        return null
    }
  }
  private findNext(from: Point<T>, to: Point<T>): MaybePoint<T> {
    const neighbors = this.getConnectedNeighbors(to)
    if (!neighbors) return null
    const [first, second] = neighbors
    if (first === from && second) return second
    if (second === from && first) return first
    return null
  }
  private getPath() {
    const startNeighbors = this.getAdjacentNeighbors(this.start)
    for (const neighbor of startNeighbors) {
      const firstNeighbor = neighbor
      let distance = 0
      let prevNeighbor = this.start
      let current = neighbor
      let path = new Set<Point<T>>([this.start])
      while (current && current !== this.start) {
        path.add(current)
        const nextNeighbor = this.findNext(prevNeighbor, current)
        prevNeighbor = current
        current = nextNeighbor
        distance++
      }
      if (current === this.start) {
        const key = `${firstNeighbor!.x! - prevNeighbor.x}${
          firstNeighbor!.y - prevNeighbor.y
        }`

        this.start.val = convertXYMap[key as keyof typeof convertXYMap] as T
        this.distance = (distance + 1) / 2
        this.path = path
        return
      }
    }
  }
  //   canPtEscape = (
  //     pt: Point<T>,
  //     ptsThatEscape: Set<Point<T>>,
  //     currentPath: Point<T>[] = [],
  //   ): boolean => {
  //     currentPath.push(pt)

  //     if (pt.wasVisited) {
  //       return ptsThatEscape.has(pt)
  //     }

  //     if (ptsThatEscape.has(pt)) {
  //       currentPath.forEach(prevPt => ptsThatEscape.add(prevPt))
  //       return true
  //     }

  //     const allNeigbors = this.getAllNeighbors(pt)
  //     for (const neighbor of allNeigbors) {
  //       if (!neighbor) {
  //         currentPath.forEach(prevPt => ptsThatEscape.add(prevPt))
  //         return true
  //       }
  //     }

  //     const neighborsToCheck = allNeigbors
  //       .filter(Boolean)
  //       .filter(neighbor => !this.path.has(neighbor))
  //       .filter(neighbor => !currentPath.includes(neighbor))

  //     if (neighborsToCheck.length === 0) return false

  //     pt.wasVisited = true

  //     for (const neighbor of neighborsToCheck) {
  //       if (this.canPtEscape(neighbor, ptsThatEscape, currentPath)) {
  //         currentPath.forEach(prevPt => ptsThatEscape.add(prevPt))
  //         return true
  //       }
  //     }
  //     return false
  //   }
}

const parseInput = (rawInput: string) => {
  return new SuperGrid(rawInput.split("\n").map(line => line.split("")))
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  return grid.distance
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  grid.draw()
  let numPoints = 0
  let isInside = false

  grid.pointsList().forEach(pt => {
    const isInPath = grid.path.has(pt)
    if (["7", "F", "|"].includes(pt.val) && isInPath) {
      isInside = !isInside
    }
    if (isInside && !isInPath) {
      numPoints++
    }
  })

  return numPoints
  // const ptsThatEscape = new Set<Point<string>>()
  // return grid
  //   .pointsList()
  //   .filter(pt => !grid.path.has(pt))
  //   .map(pt => grid.canPtEscape(pt, ptsThatEscape))
  //   .filter(canEscape => !canEscape).length
}

run({
  part1: {
    tests: [
      // {
      //   input: `
      //   -L|F7
      //   7S-7|
      //   L|7||
      //   -L-J|
      //   L|-JF
      //   `,
      //   expected: 4,
      // },
      // {
      //   input: `
      //   7-F7-
      //   .FJ|7
      //   SJLL7
      //   |F--J
      //   LJ.LJ
      //   `,
      //   expected: 8,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ...........
        .S-------7.
        .|F-----7|.
        .||.....||.
        .||.....||.
        .|L-7.F-J|.
        .|..|.|..|.
        .L--J.L--J.
        ...........
        `,
        expected: 4,
      },
      {
        input: `
        FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJ7F7FJ-
        L---JF-JLJ.||-FJLJJ7
        |F|F-JF---7F7-L7L|7|
        |FFJF7L7F-JF7|JL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L
        `,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
})
