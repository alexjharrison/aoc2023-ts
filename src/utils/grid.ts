
export class Point<T>{
  constructor(public x: number, public y: number, public val: T) { }
  public coords = () => [this.y, this.x]
  public __str__ = () => this.val
}

export class Grid<T extends string> {
  public points: Point<T>[][]
  public height: number
  public width: number
  constructor(public lines: T[][]) {
    this.points = lines.map((line, y) =>
      line.map((val, x) =>
        new Point(x, y, val)))

    // self.points = [[Point(x, y, int(val) if val.isdigit() else val) for x, val in enumerate(line)]
    //for y, line in enumerate(lines)]

    this.height = lines.length
    this.width = lines[0].length

  }
  public draw = () => {
    for (const row of this.points) {
      for (const col of row) {
        process.stdout.write(col.val + "")
      }
      console.log("")
    }
  }
  public getPoint = (x: number, y: number) => this.points[y][x]
  public getLeft = (x: number, y: number) => x === 0 ? null : this.getPoint(x - 1, y)
  public getRight = (x: number, y: number) => x === this.width - 1 ? null : this.getPoint(x + 1, y)
  public getAbove = (x: number, y: number) => y === 0 ? null : this.getPoint(x, y - 1)
  public getBelow = (x: number, y: number) => y === this.height - 1 ? null : this.getPoint(x, y + 1)
  public getTopLeft = (x: number, y: number) => {
    const above = this.getAbove(x, y)
    const left = this.getLeft(x, y)
    if (!above || !left) return null
    return this.getPoint(left.x, above.y)
  }
  public getTopRight = (x: number, y: number) => {
    const above = this.getAbove(x, y)
    const right = this.getRight(x, y)
    if (!above || !right) return null
    return this.getPoint(right.x, above.y)
  }
  public getBottomLeft = (x: number, y: number) => {
    const below = this.getBelow(x, y)
    const left = this.getLeft(x, y)
    if (!below || !left) return null
    return this.getPoint(left.x, below.y)
  }
  public getBottomRight = (x: number, y: number) => {
    const below = this.getBelow(x, y)
    const right = this.getRight(x, y)
    if (!below || !right) return null
    return this.getPoint(right.x, below.y)
  }
  public isNumber = (x: number, y: number) => /^-?\d+$/.test(this.getPoint(x, y).val)
}

// const grid = new Grid(["OXX".split(''), "XOX".split(''), "XXX".split('')])
// grid.draw()
