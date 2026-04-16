export interface PositiveCase {
  cumulative_cases: number;
  first_diagnosis_date: string;
  positive_cases_int: number;
  positive_cases: string;
  seven_day_rolling_avg: number;
}

export interface PositiveCases {
  rows: PositiveCase[];
}
