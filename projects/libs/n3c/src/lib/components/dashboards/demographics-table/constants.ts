import {KpiTotalMap} from '@odp/n3c/lib/services/base-manager/base.manager.types';
import {CellClassParams, CellStyle, ColDef, GridOptions} from 'ag-grid-community';

// Define the color scales
export const ethnicityRange = ['#332380', '#B6AAF3', '#a6a6a6'];
export const sexRange = ['#4833B2', '#ffa600', '#8406D1', '#a6a6a6'];

export const validTopics = () => topicOptions.map((v) => v.value);
export const topicOptions = [
  {value: 'participant_info', label: 'Enclave Cumulative Participant Information'},
  {value: 'patient_distribution', label: 'Patient Distribution'}
];

export const filterMap = (selectedTopic: string) => {
  const filters = [
    {
      title: 'Race',
      values: ['White', 'Black', 'Asian', 'AI/AN', 'NHPI', 'Other', 'Unknown']
    },
    {
      title: 'Sex',
      values: ['Female', 'Male', 'Other', 'Unknown']
    }
  ];

  if (selectedTopic !== 'participant_info') {
    filters.unshift({
      title: 'Ethnicity',
      values: ['Not Hisp/Lat', 'Hisp/Lat', 'Unknown']
    });
  }

  return [filters];
};

export const selectedFilters = () => ({
  sex: [],
  race: [],
  ethnicity: []
});

export const kpiTotalMap: KpiTotalMap[] = [
  {
    prop: 'totals.Total',
    reduce: false,
    stat: 'numTPIE'
  },
  {
    prop: 'ethnicityTotals.Not Hisp/Lat',
    reduce: false,
    stat: 'numTNHP'
  },
  {
    prop: 'ethnicityTotals.Hisp/Lat',
    reduce: false,
    stat: 'numTHP'
  },
  {
    prop: 'ethnicityTotals.Unknown',
    reduce: false,
    stat: 'numTPUE'
  }
];

export const colorSchemeMap: Record<string, string[]> = {
  sexRange: sexRange,
  ethnicityRange: ethnicityRange
};

// Define ag-grid configs
export const columnDefs: ColDef[] = [
  {
    headerName: 'Racial Categories & Sex',
    valueGetter: (params) => (params.data.isParent ? params.data.race : params.data.sex),
    cellStyle: (params) => categoryCellStyle(params)
  },
  {
    headerName: 'Non-Hispanic or Latino',
    field: 'nonHispanic',
    type: 'numericColumn',
    cellStyle: (params) => categoryCellStyle(params)
  },
  {
    headerName: 'Hispanic or Latino',
    field: 'hispanic',
    type: 'numericColumn',
    cellStyle: (params) => categoryCellStyle(params)
  },
  {
    headerName: 'Unknown or Not Reported',
    field: 'unknown',
    type: 'numericColumn',
    cellStyle: (params) => categoryCellStyle(params)
  },
  {
    headerName: 'Total',
    field: 'total',
    type: 'numericColumn',
    cellStyle: (params) => categoryCellStyle(params)
  }
];

export const demoColumnDefs: ColDef[] = [
  {field: 'race', headerName: 'Race', flex: 10, sortable: true, filter: 'agTextColumnFilter', resizable: true},
  {field: 'ethnicity', headerName: 'Ethnicity', flex: 3, filter: 'agTextColumnFilter', resizable: true},
  {field: 'sex', headerName: 'Sex', flex: 3, filter: 'agTextColumnFilter', resizable: true},
  {field: 'patient_count', headerName: 'Patient Count', width: 120, filter: 'agTextColumnFilter', resizable: true}
];

export const defaultColDef = {
  flex: 1,
  headerClass: 'ag-header-cell-label'
};

export const gridOptions = {
  animateRows: true,
  pagination: false
};

export const demoGridOptions: GridOptions = {
  headerHeight: 40,
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 25, 50, 75, 100],
  quickFilterText: '', // Enables the quick filter functionality
  domLayout: 'autoHeight',
  context: {
    showSearchBox: true, // Add this to toggle the search box
    searchBoxWidth: '400px' // Add this to set the width of the search box
  }
};

const categoryCellStyle = (params: CellClassParams<any, any>): CellStyle => {
  if (params.data.isParent) {
    return {
      fontWeight: 'bold',
      backgroundColor: '#e3f2fd',
      textAlign: 'center'
    };
  } else {
    return {
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      textAlign: 'center'
    };
  }
};
