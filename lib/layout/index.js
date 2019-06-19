import Graph from './graph.js';

const NodeWidth = 100;
const NodeHeight = 24;
// const NodeDistance = 30;
const BlockPadding = {
  x: 30,
  y: 30
};
const padding = {
  x: 50,
  y: 50
};
const CanvasHeight = 500;
function layout({ edges, nodes }) {
  const G = new Graph({ edges, nodes });
  G.buildGraph();
  G.topologicalSort();
  const nodesDepth = G.nodesDepth;
  // const maxDepth = Math.max(...G.depth);
  let maxTotalRank = 0;
  for (let i = 0; i < nodesDepth.length; i++) {
    maxTotalRank = Math.max(nodesDepth[i].rank, maxTotalRank);
  }
  nodesDepth.forEach(node => {
    node.width = NodeWidth;
    node.height = NodeHeight;
    node.x = node.depth * (NodeWidth + BlockPadding.x) + padding.x;
    node.y = node.rank * (NodeHeight + BlockPadding.y) + padding.y;
    if (node.maxRank === 0) {
      node.y = CanvasHeight / 2;
    } else {
      let height = CanvasHeight * Math.sqrt(node.maxRank / maxTotalRank);
      node.y = node.rank * ((height - padding.y * 2) / node.maxRank) + padding.y + (CanvasHeight - height) / 2;
    }
  });
  // edgesLinks = edges.map(edge => {
  //   if (edge.from)
  // })
  const edgesLinks = G.edgesLinks;
  edgesLinks.forEach(edge => {
    if (edge.toDepth - edge.fromDepth > 1) {
      let y = 0;
      if (edge.sourceRankRatio < 0.5) {
        y = padding.y * edge.fixHeight - NodeHeight / 2;
      } else {
        y = CanvasHeight - padding.y * edge.fixHeight + NodeHeight / 2;
      }
      let brokenStart = {
        x: (edge.fromDepth + 1) * (NodeWidth + BlockPadding.x) - BlockPadding.x / 2,
        y: edge.sourceMaxRank === 0 ? CanvasHeight / 2 : edge.sourceRank * ((CanvasHeight * Math.sqrt(edge.sourceMaxRank / maxTotalRank) - padding.y * 2) / edge.sourceMaxRank) + padding.y + (CanvasHeight - CanvasHeight * Math.sqrt(edge.sourceMaxRank / maxTotalRank)) / 2
      };
      let brokenPoint1 = {
        x: (edge.fromDepth + 1) * (NodeWidth + BlockPadding.x) - BlockPadding.x / 2,
        y
      };
      let brokenPoint2 = {
        x: (edge.toDepth + 1 - 1) * (NodeWidth + BlockPadding.x) - BlockPadding.x / 2,
        y
      };
      let brokenEnd = {
        x: (edge.toDepth + 1 - 1) * (NodeWidth + BlockPadding.x) - BlockPadding.x / 2,
        y: edge.targetMaxRank === 0 ? CanvasHeight / 2 : edge.targetRank * ((CanvasHeight * Math.sqrt(edge.targetMaxRank / maxTotalRank) - padding.y * 2) / edge.targetMaxRank) + padding.y + (CanvasHeight - CanvasHeight * Math.sqrt(edge.targetMaxRank / maxTotalRank)) / 2
      };
      edge.controlPoints = [brokenStart, brokenPoint1, brokenPoint2, brokenEnd];
    }
  });
  return {
    nodes: nodesDepth,
    edges: edgesLinks
  };
}

export default layout;
