class Graph {
  constructor({ edges, nodes }) {
    this.indexes = nodes.map(node => node.id);
    this.indegree = nodes.map(() => 0);
    this.getIndex = {};
    this.indexes.forEach((index, it) => {
      this.getIndex[index] = it;
    });
    this.nodes = nodes;
    this.edges = edges;
    this.graph = [];
    this.edges.forEach(edge => {
      this.indegree[this.getIndex[edge.target]]++;
    });
    this.depth = nodes.map(() => 0);
  }

  get nodesDepth () {
    const nodes = this.nodes.map((node, index) => {
      return {
        ...node,
        depth: this.depth[index]
      };
    });
    const maxDepth = Math.max(...this.depth);
    for (let i = 0; i <= maxDepth; i++) {
      let rank = 0;
      let maxRank = 0;
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].depth === i) {
          nodes[j].rank = rank++;
          maxRank = Math.max(nodes[j].rank, maxRank);
        }
      }
      for (let j = 0; j < nodes.length; j++) {
        if (nodes[j].depth === i) {
          nodes[j].maxRank = maxRank;
        }
      }
    }
    return nodes;
  }

  get edgesLinks () {
    const maxDepth = Math.max(...this.depth);
    const nodes = this.nodesDepth;
    return this.edges.map(edge => {
      let dDepth = this.depth[this.getIndex[edge.target]] - this.depth[this.getIndex[edge.source]];
      return {
        ...edge,
        fixHeight: dDepth / maxDepth,
        fromDepth: this.depth[this.getIndex[edge.source]],
        toDepth: this.depth[this.getIndex[edge.target]],
        sourceRankRatio: nodes[this.getIndex[edge.source]].rank / nodes[this.getIndex[edge.source]].maxRank,
        targetRankRatio: nodes[this.getIndex[edge.target]].rank / nodes[this.getIndex[edge.target]].maxRank,
        sourceRank: nodes[this.getIndex[edge.source]].rank,
        targetRank: nodes[this.getIndex[edge.target]].rank,
        sourceMaxRank: nodes[this.getIndex[edge.source]].maxRank,
        targetMaxRank: nodes[this.getIndex[edge.target]].maxRank
      };
    });
  }

  buildGraph() {
    // init graph with adj list
    this.graph = [];
    this.graph = this.nodes.map(() => []);
    for (let edge of this.edges) {
      this.graph[this.getIndex[edge.source]].push(this.getIndex[edge.target]);
    }
  }

  topologicalSort() {
    let queue = [];
    for (let i = 0; i < this.indegree.length; i++) {
      if (this.indegree[i] === 0) {
        queue.push(i);
      }
    }
    while (queue.length > 0) {
      let node = queue.shift();
      for (let i = 0; i < this.graph[node].length; i++) {
        this.indegree[this.graph[node][i]]--;
        this.depth[this.graph[node][i]] = Math.max(this.depth[this.graph[node][i]], this.depth[node] + 1);
        if (this.indegree[this.graph[node][i]] === 0) {
          queue.push(this.graph[node][i]);
        }
      }
    }
  }
}

// const flowConfig = {
//   nodes: [
//     {
//       id: 'node1',
//       label: 'node1'
//     },
//     {
//       id: 'node2',
//       label: 'node2'
//     },
//     {
//       id: 'node3',
//       label: 'node3'
//     }
//   ],
//   edges: [
//     {
//       label: 'edge1',
//       from: 'node1',
//       to: 'node2'
//     },
//     {
//       label: 'edge2',
//       from: 'node3',
//       to: 'node2'
//     }
//   ]
// };

// let G = new Graph(flowConfig);
// console.log(G)
// G.buildGraph();
// console.log(G)
// G.topologicalSort();
// console.log(G.nodesDepth);

export default Graph;
