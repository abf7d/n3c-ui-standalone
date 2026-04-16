import {ColDef} from 'ag-grid-community';

export const legendColors: {[key: string]: string} = {
  N3C: '#007bff',
  CTSA: '#8406D1',
  GOV: '#09405A',
  CTR: '#AD1181',
  COM: '#ffa600',
  REGIONAL: '#a6a6a6',
  UNAFFILIATED: '#ff7155',
  X1: '#8B8B8B',
  X2: 'black',
  X3: 'yellow'
};

export const colDefs: ColDef[] = [
  {
    field: 'site',
    headerName: 'Site',
    flex: 8,
    filter: 'agTextColumnFilter',
    resizable: true,
    cellRenderer: 'datasourceRenderer'
  },
  {field: 'type', headerName: 'Type', flex: 4, filter: 'agTextColumnFilter', resizable: true},
  {
    field: 'count',
    headerName: 'Investigator Count',
    flex: 4,
    filter: 'agTextColumnFilter',
    resizable: true,
    cellStyle: {'text-align': 'right'}
  },
  {
    field: 'aggregate_count',
    headerName: 'Membership Count',
    flex: 4,
    filter: 'agTextColumnFilter',
    resizable: true,
    cellStyle: {'text-align': 'right'}
  },
  {
    field: 'target_count',
    headerName: 'Project Count',
    filter: 'agTextColumnFilter',
    resizable: true,
    cellStyle: {'text-align': 'right'}
  }
];
