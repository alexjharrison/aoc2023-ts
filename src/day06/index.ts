import "@total-typescript/ts-reset"
import run from "aocrunner"
import { multiply } from "../utils/utils.js"

const parseInput = (rawInput: string) => {
  const input = rawInput.split("\n")
  const parseLine = (line: string) =>
    line
      .split(":")[1]
      .split(" ")
      .filter((val) => val)
      .map(Number)
  const times = parseLine(input[0])
  const distances = parseLine(input[1])
  return times.map((totalTime, i) => ({
    totalTime,
    winningDistance: distances[i],
  }))
}

const getRaceWins = (race: {
  totalTime: number
  winningDistance: number
}): number => {
  const { totalTime, winningDistance } = race
  let raceWins = 0
  for (let pressedTime = 0; pressedTime < totalTime; pressedTime++) {
    const distance = pressedTime * (totalTime - pressedTime)
    if (distance > winningDistance) {
      raceWins++
    } else if (raceWins > 0) {
      break
    }
  }
  return raceWins
}

const part1 = (rawInput: string) => {
  const races = parseInput(rawInput)
  const waysToWin = races.map(getRaceWins)
  return multiply(waysToWin)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const time = Number(input.map(({ totalTime }) => String(totalTime)).join(""))
  const distance = Number(
    input.map(({ winningDistance }) => String(winningDistance)).join(""),
  )
  return getRaceWins({ totalTime: time, winningDistance: distance })
}

run({
  part1: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
