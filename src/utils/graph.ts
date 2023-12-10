export class Node<T> {
  constructor(
    public name: string,
    public val: T | string,
    public edges: Record<string, Edge<T>> = {},
    public visited = false,
  ) {}
}

export class Edge<T> {
  constructor(public node1: Node<T>, public node2: Node<T>, weight = 1) {}
}

export class Graph<T> {
  nodes: Record<string, Node<T>>
  constructor(
    nodesRaw: [string, T | undefined][],
    edgesRaw: [string, string, number | undefined][],
  ) {
    this.nodes = nodesRaw.reduce<Record<string, Node<T>>>(
      (nodesDict, [name, value]) => ({
        ...nodesDict,
        [name]: new Node(name, value || name),
      }),
      {},
    )
    edgesRaw.forEach(([node1Name, node2Name, weight]) => {
      const node1 = this.nodes[node1Name]
      const node2 = this.nodes[node2Name]
      const edge = new Edge(node1, node2, weight)
      node1.edges[node2Name] = edge
      node2.edges[node1Name] = edge
    })
  }
  getEdgeFromNodes = (
    node1: Node<T> | string,
    node2: Node<T> | string,
  ): Edge<T> => {
    if (typeof node1 === "string") node1 = this.nodes[node1]
    if (typeof node2 === "string") node2 = this.nodes[node2]
    return node1.edges[node2.name]
  }
}
