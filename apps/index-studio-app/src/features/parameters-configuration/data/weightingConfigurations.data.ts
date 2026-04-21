import type { WeightingConfiguration } from '../types';

export const initialWeightingConfigurations: WeightingConfiguration[] = [
  {
    id: 1,
    name: 'Market Cap Weighted',
    weightingMethod: 'FREE FLOAT MARKET CAP',
    constraints: [
      { id: 1, type: 'Security', category: 'Technology', floor: '0.5', ceiling: '10' },
      { id: 2, type: 'Sector', category: 'Financials', floor: '5', ceiling: '25' },
    ],
  },
  {
    id: 2,
    name: 'Equal Weight Strategy',
    weightingMethod: 'EQUAL WEIGHT',
    constraints: [
      { id: 1, type: 'Country', category: 'Singapore', floor: '2', ceiling: '15' },
    ],
  },
];
