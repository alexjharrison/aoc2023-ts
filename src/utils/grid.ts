export class Point {
  constructor(public x: number, public y: number, public val: string) {}
  public coords = () => [this.y, this.x]
  public __str__ = () => this.val
  public isNumber = () => /^-?\d+$/.test(this.val)
  public isEmpty = () => this.val === "."
}

export class Grid {
  public points: Point[][]
  public height: number
  public width: number
  constructor(public lines: string[][]) {
    this.points = lines.map((line, y) =>
      line.map((val, x) => new Point(x, y, val)),
    )

    // self.points = [[Point(x, y, int(val) if val.isdigit() else val) for x, val in enumerate(line)]
    //for y, line in enumerate(lines)]

    this.height = lines.length
    this.width = lines[0].length
  }
  public draw = () => {
    for (const row of this.points) {
      for (const col of row) {
        process.stdout.write((col.val === " " ? "." : col.val) + "")
      }
      console.log("")
    }
  }
  public getPoint = (x: number, y: number) => this.points[y][x]
  public getLeft = (pt: Point) =>
    pt.x === 0 ? null : this.getPoint(pt.x - 1, pt.y)
  public getRight = (pt: Point) =>
    pt.x === this.width - 1 ? null : this.getPoint(pt.x + 1, pt.y)
  public getAbove = (pt: Point) =>
    pt.y === 0 ? null : this.getPoint(pt.x, pt.y - 1)
  public getBelow = (pt: Point) =>
    pt.y === this.height - 1 ? null : this.getPoint(pt.x, pt.y + 1)
  public getTopLeft = (pt: Point) => {
    const above = this.getAbove(pt)
    const left = this.getLeft(pt)
    if (!above || !left) return null
    return this.getPoint(left.x, above.y)
  }
  public getTopRight = (pt: Point) => {
    const above = this.getAbove(pt)
    const right = this.getRight(pt)
    if (!above || !right) return null
    return this.getPoint(right.x, above.y)
  }
  public getBottomLeft = (pt: Point) => {
    const below = this.getBelow(pt)
    const left = this.getLeft(pt)
    if (!below || !left) return null
    return this.getPoint(left.x, below.y)
  }
  public getBottomRight = (pt: Point) => {
    const below = this.getBelow(pt)
    const right = this.getRight(pt)
    if (!below || !right) return null
    return this.getPoint(right.x, below.y)
  }
  public isNumber = (x: number, y: number) =>
    /^-?\d+$/.test(this.getPoint(x, y).val)
  public getNumber = (pt: Point) => {
    let here = this.getPoint(pt.x, pt.y)
    if (!here.isNumber()) return null
    while (true) {
      const left = this.getLeft(here)
      if (!left || left.isEmpty() || !left.isNumber()) break
      here = left
    }
    const points = [here]
    let num = here.val
    while (true) {
      const right = this.getRight(here)
      if (!right || right.isEmpty() || !right.isNumber()) break
      num += right.val
      here = right
      points.push(here)
    }
    return { number: Number(num), points }
  }
}

// const grid = new Grid(["OXX".split(""), "XOX".split(""), "XXX".split("")])
// grid.draw()
