export interface ChartSegment {
  value: number;
  color: string;
  label: string;
  percentage?: number;
}

export interface ChartGroup {
  label: string;
  segments: ChartSegment[];
}
