export interface FilterDataGroup {
  title: string;
  type?: string;
  description?: string;
  values: string[];
}

export interface FilterViewGroup {
  title: string;
  type?: string;
  collapsed: boolean;
  description?: string;
  values: {value: string; checked: boolean; hide: boolean}[];
}
