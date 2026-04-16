export interface Node {
  mapping: string; // e.g., "4-1"
  label: string; // e.g., "Not Hispanic or Latino"
  short_label: string; // e.g., "Not Hisp/Lat"
  x: number; // x-coordinate
  y: number; // y-coordinate
  weight: number; // Weight of the node
}

export interface Edge {
  source: string; // Source node mapping, e.g., "3-1"
  target: string; // Target node mapping, e.g., "4-1"
  weight: number; // Weight of the edge
}

export interface Chart {
  axes: string[]; // List of axes, e.g., ["Age", "Severity", "Sex", "Race", "Ethnicity"]
  nodes: Node[]; // Array of Node objects
  edges: Edge[]; // Array of Edge objects
}
