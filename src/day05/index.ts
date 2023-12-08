import "@total-typescript/ts-reset"
import run from "aocrunner"

const things = [
  "seed",
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
] as const
type Things = (typeof things)[number]
type Conversions = {
  [K in `${Things}-${Things}`]?: {
    destinationStart: number
    sourceStart: number
    range: number
  }[]
}

const parseInput = (rawInput: string) => {
  const blocks = rawInput.split("\n\n")
  const seedsLine = blocks.shift()
  const seeds = seedsLine?.split(": ")[1].split(" ").map(Number)
  const conversionsMap: Conversions = {}
  for (const block of blocks) {
    const lines = block.split("\n")
    const firstLine = lines.shift()
    const [firstThing, secondThing] = (firstLine as string)
      .replace(" map:", "")
      .split("-to-")
    const key = `${firstThing}-${secondThing}` as keyof Conversions
    conversionsMap[key] = []
    for (const line of lines) {
      const [destinationStart, sourceStart, range] = line.split(" ").map(Number)
      conversionsMap[key]?.push({
        destinationStart,
        sourceStart,
        range,
      })
    }
  }
  return { seeds, conversionsMap }
}

function getYfromX(
  source: Things,
  destination: Things,
  conversions: Conversions,
  input: number,
): number {
  const key = `${source}-${destination}` as keyof Conversions
  const ranges = conversions[key]

  for (const convert of ranges || []) {
    const { destinationStart, range, sourceStart: st } = convert
    if (input >= st && input < st + range) {
      const offset = input - st
      const output = destinationStart + offset
      return output
    }
  }
  return input
}

function getXfromY(
  source: Things,
  destination: Things,
  conversions: Conversions,
  input: number,
): number {
  const key = `${destination}-${source}` as keyof Conversions
  const ranges = conversions[key]

  for (const convert of ranges || []) {
    const { destinationStart, range, sourceStart: st } = convert
    if (input >= destinationStart && input < destinationStart + range) {
      const offset = input - destinationStart
      const output = st + offset
      return output
    }
  }
  return input
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const finalValues = []
  for (const seed of input.seeds || []) {
    let currentVal = seed
    for (let i = 1; i < things.length; i++) {
      const sourceKey = things[i - 1]
      const destKey = things[i]
      currentVal = getYfromX(
        sourceKey,
        destKey,
        input.conversionsMap,
        currentVal,
      )
    }
    finalValues.push(currentVal)
  }
  return Math.min(...finalValues)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const seedRanges = input.seeds?.reduce<[number, number][]>(
    (acc, seed, i, arr) => {
      if (i % 2 === 0) return acc
      const tuple = [arr[i - 1], seed] as [number, number]
      return [...acc, tuple]
    },
    [],
  )
  let i = 0
  while (true) {
    let currentVal = i
    for (let thingIdx = 1; thingIdx < things.length; thingIdx++) {
      const reversedThings = things.toReversed()
      const sourceKey = reversedThings[thingIdx - 1]
      const destKey = reversedThings[thingIdx]

      currentVal = getXfromY(
        sourceKey,
        destKey,
        input.conversionsMap,
        currentVal,
      )
    }
    for (const [startVal, range] of seedRanges || []) {
      if (currentVal >= startVal && currentVal < startVal + range) {
        return i
      }
    }
    i++
  }
}

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48

        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15

        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4

        water-to-light map:
        88 18 7
        18 25 70

        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13

        temperature-to-humidity map:
        0 69 1
        1 0 69

        humidity-to-location map:
        60 56 37
        56 93 4
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      seeds: 79 14 55 13

      seed-to-soil map:
      50 98 2
      52 50 48

      soil-to-fertilizer map:
      0 15 37
      37 52 2
      39 0 15

      fertilizer-to-water map:
      49 53 8
      0 11 42
      42 0 7
      57 7 4

      water-to-light map:
      88 18 7
      18 25 70

      light-to-temperature map:
      45 77 23
      81 45 19
      68 64 13

      temperature-to-humidity map:
      0 69 1
      1 0 69

      humidity-to-location map:
      60 56 37
      56 93 4
      `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
