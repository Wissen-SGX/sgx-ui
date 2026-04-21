import type { UniverseConfiguration } from '../types';

export const initialUniverseConfigurations: UniverseConfiguration[] = [
  {
    id: 1,
    name: 'Tech Universe - Large Cap Filter',
    universeId: 2,
    filterSetId: 1,
    reviewDate: '2024-04-15',
    frequency: 'Monthly',
    status: 'Completed',
    createdBy: 'Current User',
    createdAt: '2024-03-10 09:30 AM',
    generatedFiles: [
      {
        id: 1,
        fileName: 'tech_largecap_holdings_2024_Q1.csv',
        generatedAt: '2024-03-10 10:45 AM',
        fileSize: '450 KB',
        status: 'Completed',
      },
      {
        id: 2,
        fileName: 'tech_largecap_analytics_2024_Q1.xlsx',
        generatedAt: '2024-03-10 10:46 AM',
        fileSize: '1.2 MB',
        status: 'Completed',
      },
    ],
  },
];
