import type { FilterSet } from '../types';

export const initialFilterSets: FilterSet[] = [
  {
    id: 1,
    name: 'Large Cap Filter',
    description: 'Filters for large capitalization stocks with significant free float',
    createdBy: 'John Smith',
    createdAt: '2024-01-15 10:30 AM',
    modifiedBy: 'John Smith',
    modifiedAt: '2024-01-15 10:30 AM',
    filters: [
      { id: 1, field: 'Market Cap (SO Price)', operator: '>', value: '1000000000', enabled: true },
      { id: 2, field: 'Free-Float (%)', operator: '>', value: '20', enabled: true },
    ],
  },
  {
    id: 2,
    name: 'Dividend Screen',
    description: 'Screens for dividend-paying stocks with consistent payout history',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-02-10 02:15 PM',
    modifiedBy: 'Mike Chen',
    modifiedAt: '2024-03-05 11:20 AM',
    filters: [
      { id: 1, field: 'Dvd 12M Yid- Net', operator: '>', value: '3', enabled: true },
      { id: 2, field: 'Dvd P/O.Y', operator: '>=', value: '1', enabled: true },
    ],
  },
  {
    id: 3,
    name: 'Liquidity Filter',
    description: 'Ensures adequate trading liquidity and market capitalization',
    createdBy: 'Mike Chen',
    createdAt: '2024-03-01 09:45 AM',
    modifiedBy: 'Mike Chen',
    modifiedAt: '2024-03-01 09:45 AM',
    filters: [
      { id: 1, field: 'Turnover (Median) (USD) 6M', operator: '>', value: '500000', enabled: true },
      { id: 2, field: 'Market Capitalisation (Median) (M USD) 6M', operator: '>', value: '100', enabled: true },
    ],
  },
];
