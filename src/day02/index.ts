import run from "aocrunner"

type Colors = {
  blue: number
  red: number
  green: number
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split('\n')
  return lines.map(line => {
    const [idStr, valStr] = line.split(': ')
    const id = Number(idStr.split(' ')[1])
    const rolls: Colors[] = valStr.split('; ').map(roll => {
      const cubes = roll.split(', ')
      return cubes.reduce((obj, cube) => {
        const [num, color] = cube.split(' ')
        return {
          ...obj,
          [color]: Number(num)
        }
      }, { blue: 0, green: 0, red: 0 })
    })
    return { [id]: [...rolls] }
  })
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const maxes: Colors = {
    red: 12,
    green: 13,
    blue: 14
  }
  console.dir({ input }, { depth: null })
  return input.reduce((sum, values) => {
    const gameNum = Object.keys(values)[0]
    const colorsSet = Object.values(Object.values(values)[0]) // <-- This is wrong. only checking first one. needs to check all
    console.dir({ gameNum, colorsSet }, { depth: null })
    for (const colors of colorsSet) {

      for (const [color, occurences] of Object.entries(colors)) {
        if (occurences > maxes[color]) {
          console.log('bad', occurences, color, maxes[color])
          return sum
        }
      }
    }
    return sum + Number(gameNum)
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).flatMap(game => Object.values(game))
  let sum = 0
  for (const game of input) {
    const max: Colors = { blue: 0, green: 0, red: 0 }
    for (const roll of game) {
      for (const [color, occurences] of Object.entries(roll)) {
        const makeTSHappyColor = color as keyof Colors
        if (max[makeTSHappyColor] < occurences) max[makeTSHappyColor] = occurences
      }
    }
    const product = max.blue * max.green * max.red
    console.log({ sum, product, max })
    sum += product
  }
  console.log({ sum })
  return sum
}

run({
  //   part1: {
  //     tests: [
  //       {
  //         input: `
  //         Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
  //         Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
  //         Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
  //         Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
  //         Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
  // `,
  //         expected: 8,
  //       },
  //     ],
  //     solution: part1,
  //   },
  part2: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
