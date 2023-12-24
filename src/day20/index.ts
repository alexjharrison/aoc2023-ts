import "@total-typescript/ts-reset"
import run from "aocrunner"
import { range } from "../utils/utils.js"

interface Node {
  name: string
  targetStr: string[]
  targets: Node[]
  state: boolean
  connectedInputs: Node[]
  run: () => {
    nextOps: Node["run"][]
    highs: number
    lows: number
  }
  toggle: (message: boolean) => void
}
class Broadcaster implements Node {
  constructor(
    public name: string,
    public targetStr: string[],
    public state = false,
    public connectedInputs: Node[] = [],
    public targets: Node[] = [],
  ) {}
  run = () => {
    const output: ReturnType<Node["run"]> = {
      nextOps: [],
      highs: 0,
      lows: 0,
    }
    for (const target of this.targets) {
      target.toggle(false)
      output.lows++
      output.nextOps.push(target.run)
    }
    return output
  }
  toggle = (_message: boolean) => {}
}
class Flipflop implements Node {
  constructor(
    public name: string,
    public targetStr: string[],
    public state = false,
    public connectedInputs: Node[] = [],
    public targets: Node[] = [],
  ) {}
  run = () => {
    const output: ReturnType<Node["run"]> = {
      nextOps: [],
      highs: 0,
      lows: 0,
    }
    if (!this.state) return output

    for (const target of this.targets) {
      target.toggle(this.state)
      this.state ? output.highs++ : output.lows++
      output.nextOps.push(target.run)
    }
    return output
  }
  toggle = (message: boolean) => {
    if (message) return
    this.state = !this.state
  }
}
class Conjunction implements Node {
  constructor(
    public name: string,
    public targetStr: string[],
    public state = false,
    public connectedInputs: Node[] = [],
    public targets: Node[] = [],
  ) {}
  run = () => {
    const output: ReturnType<Node["run"]> = {
      nextOps: [],
      highs: 0,
      lows: 0,
    }
    this.state = !this.connectedInputs.every(input => input.state)
    for (const target of this.targets) {
      target.toggle(this.state)
      this.state ? output.highs++ : output.lows++
      output.nextOps.push(target.run)
    }
    return output
  }
  toggle = (_message: boolean) => {}
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const nodes: Record<string, Node> = {}
  for (const line of lines) {
    const [nameEnc, targetsStr] = line.split(" -> ")
    const targets = targetsStr.split(", ")
    const [moduleType, name] = [nameEnc[0], nameEnc.slice(1)]

    const TNode =
      name === "roadcaster"
        ? Broadcaster
        : moduleType === "%"
        ? Conjunction
        : Flipflop
    nodes[name] = new TNode(name, targets)
  }
  for (const node of Object.values(nodes)) {
    node.targets = node.targetStr.map(targetName => nodes[targetName])
    node.targets.forEach(targetNode => targetNode.connectedInputs.push(node))
  }
  console.log(nodes)
  return nodes
}

const part1 = (rawInput: string) => {
  const nodes = parseInput(rawInput)
  let allLows = 0
  let allHighs = 0
  const buttonPresses = 1000
  for (const _ in range(buttonPresses)) {
    allLows++ // for initial button press to roadcaster
    let allOps = [nodes.roadcaster.run]
    while (allOps.length > 0) {
      allOps = allOps.flatMap(op => {
        const { highs, lows, nextOps } = op()
        allHighs += highs
        allLows += lows
        return nextOps
      })
    }
  }
  return allHighs * allLows
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
        broadcaster -> a, b, c
        %a -> b
        %b -> c
        %c -> inv
        &inv -> a
        `,
        expected: 32000000,
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
  onlyTests: true,
})
