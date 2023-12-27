import "@total-typescript/ts-reset"
import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  return lines.map(line => {
    const [startPosStr, velocityStr] = line.split(" @ ")
    const [x0, y0, z0] = startPosStr.split(", ").map(Number)
    const [vx, vy, vz] = velocityStr.split(", ").map(Number)
    return { x0, y0, z0, vx, vy, vz }
  })
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let intersections = 0
  // const bounds = [7, 27]
  const bounds = [200000000000000, 400000000000000]
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const l1 = input[i]
      const l2 = input[j]
      const m1 = l1.vy / l1.vx
      const m2 = l2.vy / l2.vx
      const b1 = l1.y0 - m1 * l1.x0
      const b2 = l2.y0 - m2 * l2.x0
      const x = (b2 - b1) / (m1 - m2)
      const y = m1 * x + b1

      if (x < bounds[0] || x > bounds[1] || y < bounds[0] || y > bounds[1]) {
        // console.log("oob", { l1, l2 })
        continue
      }

      if (
        (l1.vx > 0 && x < l1.x0) ||
        (l1.vx < 0 && x > l1.x0) ||
        (l2.vx > 0 && x < l2.x0) ||
        (l2.vx < 0 && x > l2.x0)
      ) {
        // console.log("out of time", { l1, l2 })
        continue
      }

      intersections++
    }
  }
  return intersections
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
        19, 13, 30 @ -2,  1, -2
        18, 19, 22 @ -1, -1, -2
        20, 25, 34 @ -2, -2, -4
        12, 31, 28 @ -1, -2, -1
        20, 19, 15 @  1, -5, -3
        `,
        expected: 2,
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
