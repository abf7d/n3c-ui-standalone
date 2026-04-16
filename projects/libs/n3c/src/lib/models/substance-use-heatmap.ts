export interface HeatmapProperties {
  source_label: string;
  target_label: string;
  source_tooltip_label: string;
  target_tooltip_label: string;
  xaxis_label: string;
  cell_size: number;
  margin: {top: number; right: number; bottom: number; left: number};
  sub20hack: number;
  chartEl: any;
  legendEl: any;
}
export interface ChartNode {
  url: string;
  name: string;
  group: string;
  score: number;
  site: number;
  index?: number;
  new_index?: number;
}
export interface ChartLink {
  source: number;
  target: number;
  value: number;
}
export interface HeatmapDataChart {
  links: ChartLink[];
  nodes: ChartNode[];
}

