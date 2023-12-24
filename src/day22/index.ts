import "@total-typescript/ts-reset"
import run from "aocrunner"

type Point = {
  x: number
  y: number
  z: number
}

const js = (v: object) => JSON.stringify(v)
const jp = (v: string) => JSON.parse(v) as Point
const belowStrPt = (v: string) => {
  const pt = jp(v)
  pt.z--
  return js(pt)
}
const getLowestZ = (v: Set<string>) =>
  Math.min(+[...v].map(_ => +_.split('z":')[1].slice(0, -1)))

class Jenga {
  public coords = new Set<string>()
  public bricks: Set<string>[] = []
  constructor(brickEnds: Point[][]) {
    for (const [first, second] of brickEnds) {
      const brick = new Set<string>()
      const xHigher = first.x < second.x
      for (
        let x = first.x;
        xHigher ? x <= second.x : x >= second.x;
        xHigher ? x++ : x--
      ) {
        const yHigher = first.y < second.y
        for (
          let y = first.y;
          yHigher ? y <= second.y : y >= second.y;
          yHigher ? y++ : y--
        ) {
          const zHigher = first.z < second.z
          for (
            let z = first.z;
            zHigher ? z <= second.z : z >= second.z;
            zHigher ? z++ : z--
          ) {
            const point = js({ x, y, z })
            this.coords.add(point)
            brick.add(point)
          }
        }
      }
      this.bricks.push(brick)
    }
    this.collapseAll()
  }
  collapseAll = () => {
    let falling = true
    while (falling) {
      falling = false
      for (const brick of this.bricks) {
        if (this.canFallOne(brick)) {
          falling = true
          this.fallOne(brick)
        }
      }
      this.sortBricks()
    }
  }
  sortBricks = () => {
    this.bricks.sort((a, b) => getLowestZ(a) - getLowestZ(b))
  }
  canFallOne = (brick: Set<string>) =>
    [...brick].every(block => {
      const below = belowStrPt(block)
      if (jp(below).z < 0) return false
      return brick.has(below) || !this.coords.has(below)
    })
  fallOne = (brick: Set<string>) => {
    ;[...brick].forEach(block => {
      brick.delete(block)
      this.coords.delete(block)
      const below = belowStrPt(block)
      brick.add(below)
      this.coords.add(below)
    })
  }
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const brickEnds = lines.map(line =>
    line
      .split("~")
      .map(coords =>
        coords
          .split(",")
          .map(Number)
          .reduce<Point>(
            (acc, coord, i) => {
              const map = ["x", "y", "z"]
              const key = map[i]
              return {
                ...acc,
                [key]: coord,
              }
            },
            { x: -1, y: -1, z: -1 },
          ),
      )
      .toSorted((a, b) => a.z - b.z),
  )
  return new Jenga(brickEnds)
}

const part1 = (rawInput: string) => {
  const jenga = parseInput(rawInput)
  let disintegrations = 0
  for (let i = 0; i < jenga.bricks.length; i++) {
    const brickList = jenga.bricks.toSpliced(i, 1)
    const originalBrick = jenga.bricks[i]
    for (const block of originalBrick) {
      jenga.coords.delete(block)
    }

    for (const brick of brickList) {
      if (jenga.canFallOne(brick)) {
        disintegrations++
        continue
      }
    }

    for (const block of originalBrick) {
      jenga.coords.add(block)
    }
  }
  return jenga.bricks.length - disintegrations + 1
}

const part2 = (rawInput: string) => {
  const jenga = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `
        1,0,1~1,2,1
        0,0,2~2,0,2
        0,2,3~2,2,3
        0,0,4~0,2,4
        2,0,5~2,2,5
        0,1,6~2,1,6
        1,1,8~1,1,9
        `,
        expected: 5,
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
