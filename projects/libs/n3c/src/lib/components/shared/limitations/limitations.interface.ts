export interface Section {
  header: string;
  description?: string;
  inline?: boolean;
  numbered?: boolean;
  items: (string | NestedItems)[];
}

export interface NestedItems {
  items: (string | NestedItems)[];
  numbered?: boolean;
}

export interface LimitationsConfig {
  intro: string;
  sections: Section[];
}
