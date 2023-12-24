import { Point } from "./grid.js"

const mod = (n: number, m: number) => ((n % m) + m) % m

export class Infinigrid<T> {
  public points: Point<T>[][]
  public height: number
  public width: number
  private infiniPts: Map<string, Point<T>>
  constructor(public lines: T[][]) {
    this.points = lines.map((line, y) =>
      line.map((val, x) => new Point(x, y, val)),
    )

    this.height = lines.length
    this.width = lines[0].length
    this.infiniPts = new Map<string, Point<T>>(
      this.pointsList().map(pt => [this.getPtName(pt), pt]),
    )
  }
  public draw = (field?: keyof T) => {
    for (const row of this.points) {
      let line = ""
      for (const col of row) {
        line += field ? col.val[field] : col.val
      }
      console.log(line)
    }
  }
  private getPtName = (pt: Point<T>) => `${pt.x}-${pt.y}`
  public pointsList = () => this.points.flatMap(row => row)

  public getPoint = (x: number, y: number) => {
    const key = `${x}-${y}`
    const pt = this.infiniPts.get(key)
    if (pt) return pt
    const val = this.points[mod(y, this.height)][mod(x, this.width)].val
    const newPt = new Point(x, y, (val === "S" ? "." : val) as T)
    this.infiniPts.set(key, newPt)
    return newPt
  }

  public getLeft = (pt: Point<T>) => this.getPoint(pt.x - 1, pt.y)
  public getRight = (pt: Point<T>) => this.getPoint(pt.x + 1, pt.y)
  public getAbove = (pt: Point<T>) => this.getPoint(pt.x, pt.y - 1)
  public getBelow = (pt: Point<T>) => this.getPoint(pt.x, pt.y + 1)
  public getTopLeft = (pt: Point<T>) => {
    const above = this.getAbove(pt)
    const left = this.getLeft(pt)
    if (!above || !left) return null
    return this.getPoint(left.x, above.y)
  }
  public getTopRight = (pt: Point<T>) => {
    const above = this.getAbove(pt)
    const right = this.getRight(pt)
    if (!above || !right) return null
    return this.getPoint(right.x, above.y)
  }
  public getBottomLeft = (pt: Point<T>) => {
    const below = this.getBelow(pt)
    const left = this.getLeft(pt)
    if (!below || !left) return null
    return this.getPoint(left.x, below.y)
  }
  public getBottomRight = (pt: Point<T>) => {
    const below = this.getBelow(pt)
    const right = this.getRight(pt)
    if (!below || !right) return null
    return this.getPoint(right.x, below.y)
  }
  public getAdjacentNeighbors = (pt: Point<T>) => [
    this.getAbove(pt),
    this.getRight(pt),
    this.getBelow(pt),
    this.getLeft(pt),
  ]
  public getAllNeighbors = (pt: Point<T>) => [
    this.getAbove(pt),
    this.getTopRight(pt),
    this.getRight(pt),
    this.getBottomRight(pt),
    this.getBelow(pt),
    this.getBottomLeft(pt),
    this.getLeft(pt),
    this.getTopLeft(pt),
  ]
  public getNumber = (pt: Point<T>) => {
    let here = this.getPoint(pt.x, pt.y)
    if (!here.isNumber()) return { number: null, points: [here] }
    while (true) {
      const left = this.getLeft(here)
      if (!left || left.isEmpty() || !left.isNumber()) break
      here = left
    }
    const points = [here]
    let num = String(here.val)
    while (true) {
      const right = this.getRight(here)
      if (!right || right.isEmpty() || !right.isNumber()) break
      num += String(right.val)
      here = right
      points.push(here)
    }
    return { number: Number(num), points }
  }
}

// const grid = new Grid(["OXX".split(""), "XOX".split(""), "XXX".split("")])
// grid.draw()
