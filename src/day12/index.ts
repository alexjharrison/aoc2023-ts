import "@total-typescript/ts-reset"
import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const sequences = lines.map(line => line.split(" ")[0])
  const sizesList = lines.map(line => line.split(" ")[1].split(",").map(Number))

  return sequences.map((seq, i) => ({ sequence: seq, sizes: sizesList[i] }))
}

function countValidConfigs(
  substr: string,
  sizes: number[],
  requiredsRemaining: number,
  count = 0,
): number {
  console.log({ substr, sizes, requiredsRemaining, count })
  if (sizes.length === 0) return requiredsRemaining === 0 ? count + 1 : count

  if (substr[0] === ".")
    return countValidConfigs(substr.slice(1), sizes, requiredsRemaining, count)

  // count += countValidConfigs(substr.slice(1), sizes, requiredsRemaining, count)
  const size = sizes[0]

  for (let i = 0; i <= size; i++) {
    const letter = substr[i]
    if (!letter) return count

    if (i === size) {
      // found complete block
      if (letter === "." || letter === "?") {
        return countValidConfigs(
          substr.slice(size + 1),
          sizes.slice(1),
          requiredsRemaining,
          count,
        )
      } else {
        return countValidConfigs(
          substr.slice(1),
          sizes,
          requiredsRemaining,
          count,
        )
      }
    }
    if (letter === "#") {
      requiredsRemaining--
    } else if (letter === ".") {
      return countValidConfigs(
        substr.slice(1),
        sizes,
        requiredsRemaining,
        count,
      )
    }
  }

  throw new Error("UNREACHABLE")
}

const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput)
  return lines.reduce((sum, { sequence, sizes }) => {
    const requireds = sequence.split("#").length - 1
    return sum + countValidConfigs(sequence, sizes, requireds)
  }, 0)
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
        .??..??...?##. 1,1,3
        `,
        expected: 4,
      },
      // {
      //   input: `
      //   ???.### 1,1,3
      //   .??..??...?##. 1,1,3
      //   ?#?#?#?#?#?#?#? 1,3,1,6
      //   ????.#...#... 4,1,1
      //   ????.######..#####. 1,6,5
      //   ?###???????? 3,2,1
      //   `,
      //   expected: 21,
      // },
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
  onlyTests: true,
})
