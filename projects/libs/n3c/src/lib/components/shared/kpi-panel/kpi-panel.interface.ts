export interface KpiItemConfig {
  title: string; // Title of the KPI
  value: string; // Value to display
  icon: string; // Icon class for the KPI
  tooltipTitle: string; // Tooltip title
  tooltipContent: string; // Tooltip HTML content
  footer?: string; // Optional footer for Section 1
  limitationsLink?: string; // Optional limitations link for Section 1
  // Optional progress support
  progress?: {
    value: number; // Percentage value for progress (0-100)
    tooltip: string; // Tooltip text for the progress bar
  };
}

export interface KpiColumnConfig {
  separator?: boolean; // Separator flag
  items: KpiItemConfig[]; // Array of KPI items
  rows?: KpiRowConfig[]; // Nested rows inside a column
}

export interface KpiRowConfig {
  columns: KpiColumnConfig[]; // Each row contains multiple columns
}

export type KpiPanelConfig = KpiColumnConfig[];
