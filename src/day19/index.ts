import "@total-typescript/ts-reset"
import run from "aocrunner"
import { sum } from "../utils/utils.js"

type Part = Record<string, number>

type Rule = {
  name: string
  output: string
  operations: {
    var1: string
    var2: number
    operator: string
    output: string
  }[]
}
type RuleMap = Record<string, Rule>

const parseInput = (rawInput: string) => {
  const [ruleLines, partLines] = rawInput.split("\n\n")
  const partsList: Part[] = partLines.split("\n").map(partLine =>
    partLine
      .slice(1, -1)
      .split(",")
      .map(eq => eq.split("="))
      .map(([name, val]) => ({ [name]: +val }))
      .reduce((acc, obj) => ({ ...acc, ...obj }), {}),
  )
  const rules: RuleMap = ruleLines
    .split("\n")
    .map(ruleLine => {
      const [name, stepsStr] = ruleLine.slice(0, -1).split("{")
      const steps = stepsStr.split(",")
      const output = steps.pop()!
      return {
        name,
        output,
        operations: steps.map(stepLine => {
          const [evaluation, output] = stepLine.split(":")
          const gt = evaluation.includes(">")
          return {
            output,
            operator: gt ? ">" : "<",
            var1: evaluation.split(gt ? ">" : "<")[0],
            var2: +evaluation.split(gt ? ">" : "<")[1],
          }
        }),
      }
    })
    .reduce((acc, rule) => ({ ...acc, [rule.name]: rule }), {})
  return { partsList, rules }
}

const check = (rule: Rule, rules: RuleMap, parts: Part): Part | null => {
  for (const { operator, output, var1, var2 } of rule.operations) {
    const checkVal = parts[var1]
    if (operator === "<" && checkVal < var2) {
      if (output === "R") return null
      return output === "A" ? parts : check(rules[output], rules, parts)
    }
    if (operator === ">" && checkVal > var2) {
      if (output === "R") return null
      return output === "A" ? parts : check(rules[output], rules, parts)
    }
  }
  if (rule.output === "R") return null
  if (rule.output === "A") return parts
  return check(rules[rule.output], rules, parts)
}

const part1 = (rawInput: string) => {
  const { partsList, rules } = parseInput(rawInput)
  let final = 0
  for (const parts of partsList) {
    const outputs = check(rules["in"], rules, { ...parts })
    if (outputs) final += sum(Object.values(outputs))
  }
  return final
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
        px{a<2006:qkq,m>2090:A,rfg}
        pv{a>1716:R,A}
        lnx{m>1548:A,A}
        rfg{s<537:gd,x>2440:R,A}
        qs{s>3448:A,lnx}
        qkq{x<1416:A,crn}
        crn{x>2662:A,R}
        in{s<1351:px,qqz}
        qqz{s>2770:qs,m<1801:hdj,R}
        gd{a>3333:R,R}
        hdj{m>838:A,pv}

        {x=787,m=2655,a=1222,s=2876}
        {x=1679,m=44,a=2067,s=496}
        {x=2036,m=264,a=79,s=2244}
        {x=2461,m=1339,a=466,s=291}
        {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 19114,
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
