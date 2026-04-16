export const validTopics = () => topicOptions.map((v) => v.value);
export const topicOptions = [
  {value: 'daily', label: 'Daily Patient Count & 7-day Rolling Avg.'},
  {value: 'cumulative', label: 'Cumulative Patient Count & 7-day Rolling Avg.'}
];

export const columnDefs = [
  {
    field: 'first_diagnosis_date',
    headerName: 'First Diagnosis Date',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'positive_cases',
    headerName: 'Positive Case Count',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'cumulative_cases',
    headerName: 'Cumulative Positive Case Count',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  {
    field: 'seven_day_rolling_avg',
    headerName: '7-Day Rolling Average Case Count',
    flex: 3,
    filter: 'agTextColumnFilter',
    resizable: true
  }
];
