import "@total-typescript/ts-reset"
import run from "aocrunner"
import { lcmAll, sum } from "../utils/utils.js"

type Node = {
  L: string
  R: string
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const nodes: Record<string, Node> = {}
  const steps = lines.shift()!
  lines.shift()
  for (const line of lines) {
    const [name, children] = line.split(" = ")
    const [L, R] = children.replace(/[()]/g, "").split(", ")
    nodes[name] = { L, R }
  }
  return { nodes, steps }
}

const part1 = (rawInput: string) => {
  const { nodes, steps } = parseInput(rawInput)
  let location = "AAA"
  let count = 0
  while (location !== "ZZZ") {
    let direction = steps[count % steps.length]
    location = nodes[location][direction]
    count++
  }
  return count
}

const part2 = (rawInput: string) => {
  const { nodes, steps } = parseInput(rawInput)
  const currentLocations = Object.keys(nodes).filter((name) =>
    name.endsWith("A"),
  )
  const endingPoints = new Set(
    Object.keys(nodes).filter((name) => name.endsWith("Z")),
  )
  let prevFound = 0
  const distances = currentLocations.map((location) => {
    for (let i = 0; i < 1_000_000; i++) {
      const direction = steps[i % steps.length]
      if (endingPoints.has(location)) {
        return i
      }
      location = nodes[location][direction]
    }
    return 0
  })
  return lcmAll(distances)
}

// const naivePart2 = (rawInput: string) => {
//   const { nodes, steps } = parseInput(rawInput)
//   const currentLocations = Object.keys(nodes).filter((name) =>
//     name.endsWith("A"),
//   )
//   const endingPoints = new Set(
//     Object.keys(nodes).filter((name) => name.endsWith("Z")),
//   )
//   let count = 0
//   while (true) {
//     //step all
//     for (let i = 0; i < currentLocations.length; i++) {
//       let direction = steps[count % steps.length]
//       const currentLocation = currentLocations[i]
//       currentLocations[i] = nodes[currentLocation][direction]
//     }
//     //check all
//     let allGood = true
//     for (const location of currentLocations) {
//       if (!endingPoints.has(location)) {
//         allGood = false
//         continue
//       }
//     }
//     count++
//     if (allGood) return count
//   }
// }

run({
  part1: {
    tests: [
      {
        input: `
        RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)
        `,
        expected: 2,
      },
      {
        input: `
        LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        LR
        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
