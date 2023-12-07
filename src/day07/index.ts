import run from "aocrunner"


const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const hands: Hand[] = []
  for (const line of lines) {
    const hand = new Hand(line)
    hands.push(hand)
  }
  return hands
}

const cards = [
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
  "A"
] as const
type Card = typeof cards[number]

const handTypes = [null, '1p', '2p', '3k', 'fh', '4k', '5k'] as const
type HandType = typeof handTypes[number]

class Hand {
  cards: string[]
  bid: number
  hash: Partial<Record<Card, number>>
  handType: HandType
  constructor(line: string) {
    const [cards, bid] = line.split(' ')
    this.bid = Number(bid)
    this.cards = cards.split('')
    this.hash = this.hashCards()
    this.handType = this.getHandType()
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
      if (hash[card as Card]) (hash[card as Card] as number)++
      else hash[card as Card] = 1
      return hash
    }, {})
  }
  getHandType(): HandType {
    if (this.isFiveofKind()) return '5k'
    if (this.isFourofKind()) return '4k'
    if (this.isFullHouse()) return 'fh'
    if (this.isThreeofKind()) return '3k'
    if (this.isTwoPair()) return '2p'
    if (this.isOnePair()) return '1p'
    return null
  }
  isFiveofKind() {
    return Object.values(this.hash).some(occurences => occurences === 5)
  }
  isFourofKind() {
    return Object.values(this.hash).some(occurences => occurences === 4)
  }
  isFullHouse() {
    const vals = Object.values(this.hash)
    return vals.includes(3) && vals.includes(2)
  }
  isThreeofKind() {
    return Object.values(this.hash).some(occurences => occurences === 3)
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
    return Object.values(this.hash).some(val => val === 2)
  }
  isHigherThan(opponent: Hand) {
    for (let i = 0; i < cards.length; i++) {
      const myCard = this.cards[i]
      const theirCard = opponent.cards[i]
      if (cards.indexOf(myCard) === cards.indexOf(theirCard)) continue
      return cards.indexOf(myCard) > cards.indexOf(theirCard)
    }
    throw new Error(`they're the same ${this.cards, opponent.cards}`)
  }
}


const part1 = (rawInput: string) => {
  const hands = parseInput(rawInput)
  const sorted = hands.toSorted((a, b) => a.hasBeaten(b) ? 1 : -1)
  console.log({ sorted })
  return sorted.reduce((sum, hand, i) => sum + hand.bid * (i + 1), 0)
}

const part2 = (rawInput: string) => {
  const hands = parseInput(rawInput)

  return
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
