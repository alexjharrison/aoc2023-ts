import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split('\n')
    .map(line => line.split(': ')[1]
      .trim()
      .split(' | ')
      .map(line => line
        .split(' ').map(val => val.trim()).filter(val => val)))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let sum = 0
  for (const card of input) {
    let matches = 0
    const [winnings, yours] = card
    for (const your of yours) {
      if (winnings.includes(your)) matches++
    }
    if (matches)
      sum += 2 ** (matches - 1)
  }
  return sum
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const extras: number[] = input.map(_ => 1)
  for (const idx in input) {
    let matches = 0
    const card = input[idx]
    const [winnings, yours] = card
    for (const your of yours) {
      if (winnings.includes(your)) matches++
    }

    // Need to exponentially increase here

    // for (let i = 0; i < i + matches; i++) {
    //   console.log({ extras, idx, matches })
    //   extras[idx]++
    // }
  }
  return extras.reduce((sum, num) => sum + num, 0)
}

run({
  // part1: {
  //   tests: [
  //     {
  //       input: `
  //         Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  //         Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
  //         Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
  //         Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
  //         Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
  //         Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
  //       `,
  //       expected: 13,
  //     },
  //   ],
  //   solution: part1,
  // },
  part2: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
