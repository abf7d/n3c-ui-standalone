export const cmsVisProps = {
  medicare: {
    color: '#8406D1',
    label: 'Medicare',
    viz_id: 'medicare'
  },
  medicaid: {
    color: '#AD1181',
    label: 'Medicaid',
    viz_id: 'medicaid'
  },
  mortality: {
    color: '#007bff',
    label: 'Mortality',
    viz_id: 'mortality'
  },
  viral: {
    color: '#4833B2',
    label: 'Viral Variants',
    viz_id: 'viral'
  }
};
export interface CmsBarFeedTotals {
  medicare: {
    count: number;
  };
  medicaid: {
    count: number;
  };
  mortality: {
    count: number;
  };
  viral: {
    count: number;
  };
}
