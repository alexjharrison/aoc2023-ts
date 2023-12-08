import "@total-typescript/ts-reset"
import run from "aocrunner"

const parseInput = (rawInput: string, part: number) => {
  const lines = rawInput.split("\n")
  const hands: Hand[] = []
  for (const line of lines) {
    const hand = new Hand(line, part)
    hands.push(hand)
  }
  return hands
}

const cardList = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
] as const
const cardList2 = [
  "J",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "Q",
  "K",
  "A",
] as const

type Card = (typeof cardList)[number]

const handTypes = ["", "1p", "2p", "3k", "fh", "4k", "5k"] as const
type HandType = (typeof handTypes)[number]

class Hand {
  cards: Card[]
  bid: number
  hash: Partial<Record<Card, number>>
  handType: HandType
  cardList: typeof cardList | typeof cardList2
  constructor(line: string, part: number) {
    const [cards, bid] = line.split(" ")
    this.bid = Number(bid)
    this.cards = cards.split("") as Card[]
    this.hash = this.hashCards()
    this.cardList = cardList
    this.handType = this.getHandType()

    if (part === 2) {
      let numJokers = this.hash["J"] || 0
      delete this.hash["J"]
      let highestCount = 0
      let mostOccuringCard: Card = "J"
      for (const [key, count] of Object.entries(this.hash)) {
        if (count > highestCount) {
          highestCount = count
          mostOccuringCard = key as Card
        }
      }
      this.hash[mostOccuringCard] += numJokers
      this.handType = this.getHandType()
      this.cardList = cardList2
    }
  }
  hasBeaten(opponent: Hand) {
    for (let i = 0; i < handTypes.length; i++) {
      const myHand = this.handType
      const theirHand = opponent.handType
      if (handTypes.indexOf(myHand) === handTypes.indexOf(theirHand)) continue
      return handTypes.indexOf(myHand) > handTypes.indexOf(theirHand)
    }

    return this.isHigherThan(opponent)
  }
  hashCards() {
    return this.cards.reduce<Partial<Record<Card, number>>>((hash, card) => {
      if (hash[card]) (hash[card] as number)++
      else hash[card] = 1
      return hash
    }, {})
  }
  getHandType(): HandType {
    if (this.isFiveofKind()) return "5k"
    if (this.isFourofKind()) return "4k"
    if (this.isFullHouse()) return "fh"
    if (this.isThreeofKind()) return "3k"
    if (this.isTwoPair()) return "2p"
    if (this.isOnePair()) return "1p"
    return ""
  }
  isFiveofKind() {
    if (this.cards.every((card) => card === "J")) return true
    return Object.values(this.hash).some((occurences) => occurences === 5)
  }
  isFourofKind() {
    return Object.values(this.hash).some((occurences) => occurences === 4)
  }
  isFullHouse() {
    const vals = Object.values(this.hash)
    return vals.includes(3) && vals.includes(2)
  }
  isThreeofKind() {
    return Object.values(this.hash).some((occurences) => occurences === 3)
  }
  isTwoPair() {
    const vals = Object.values(this.hash)
    let hasOne = false
    for (const val of vals) {
      if (hasOne && val === 2) return true
      else if (!hasOne && val === 2) hasOne = true
    }
    return false
  }
  isOnePair() {
    return Object.values(this.hash).some((val) => val === 2)
  }
  isHigherThan(opponent: Hand) {
    for (let i = 0; i < this.cardList.length; i++) {
      const myCard = this.cards[i]
      const theirCard = opponent.cards[i]
      if (this.cardList.indexOf(myCard) === this.cardList.indexOf(theirCard))
        continue
      return this.cardList.indexOf(myCard) > this.cardList.indexOf(theirCard)
    }
    throw new Error(`they're the same ${(this.cards, opponent.cards)}`)
  }
}

const part1 = (rawInput: string) => {
  const hands = parseInput(rawInput, 1)
  const sorted = hands.toSorted((a, b) => (a.hasBeaten(b) ? 1 : -1))
  return sorted.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0)
}

const part2 = (rawInput: string) => {
  const hands = parseInput(rawInput, 2)
  const sorted = hands.toSorted((a, b) => (a.hasBeaten(b) ? 1 : -1))
  // sorted.forEach((hand) =>
  //   console.log(`${hand.cards.join("")}: ${hand.bid} ${hand.handType}`),
  // )
  return sorted.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0)
}

run({
  part1: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 5905,
      },
      {
        input: `
        2345A 1
        Q2KJJ 13
        Q2Q2Q 19
        T3T3J 17
        T3Q33 11
        2345J 3
        J345A 2
        32T3K 5
        T55J5 29
        KK677 7
        KTJJT 34
        QQQJA 31
        JJJJJ 37
        JAAAA 43
        AAAAJ 59
        AAAAA 61
        2AAAA 23
        2JJJJ 53
        JJJJ2 41
        `,
        expected: 6839,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
