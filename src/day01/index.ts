import run from "aocrunner"

const map = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
}

function getFirst(line: string): string {
  for (let i = 0; i < line.length; i++) {
    for (const [name, value] of Object.entries(map)) {
      if (line.slice(i).startsWith(name) || line.slice(i).startsWith(value)) {
        return value
      }
    }
  }
  throw new Error("nothing found")
}
function getLast(line: string): string {
  for (let i = line.length - 1; i >= 0; i--) {
    for (const [name, value] of Object.entries(map)) {
      if (line.slice(i).startsWith(name) || line.slice(i).startsWith(value)) {
        return value
      }
    }
  }
  throw new Error("nothing found")
}

const parseInput = (rawInput: string) => {
  let lines = rawInput.split("\n")
  const cleanedLines = lines.map((line) => {
    const first = getFirst(line)
    const last = getLast(line)
    return Number(first + last)
  })
  return cleanedLines
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sum, val) => sum + val, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sum, val) => sum + val, 0)
}

run({
  part1: {
    tests: [
      {
        input: `
        1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet
        `,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
