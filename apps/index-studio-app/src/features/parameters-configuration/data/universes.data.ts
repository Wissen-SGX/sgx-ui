import type { Universe } from '../types';

export const initialUniverses: Universe[] = [
  {
    id: 1,
    universeName: 'Global Universe',
    type: 'Global Universe',
    description: 'Default global universe containing all available securities',
    uploadHistory: [
      {
        id: 1,
        fileName: 'global_universe_2024_Q1.csv',
        uploadedBy: 'John Smith',
        uploadedAt: '2024-01-15 10:30 AM',
        fileSize: '2.5 MB',
        status: 'Active',
      },
      {
        id: 2,
        fileName: 'global_universe_2023_Q4.csv',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2023-12-10 02:15 PM',
        fileSize: '2.3 MB',
        status: 'Archived',
      },
    ],
    createdAt: '2023-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    universeName: 'Tech Sector Universe',
    type: 'Custom Universe',
    description: 'Custom universe focused on technology sector companies',
    uploadHistory: [
      {
        id: 1,
        fileName: 'tech_sector_universe.csv',
        uploadedBy: 'Mike Chen',
        uploadedAt: '2024-02-20 09:45 AM',
        fileSize: '1.2 MB',
        status: 'Active',
      },
    ],
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
  },
];
