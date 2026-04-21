export interface UniverseUpload {
  id: number;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize?: string;
  status: 'Active' | 'Archived';
}

export interface Universe {
  id: number;
  universeName: string;
  type: 'Global Universe' | 'Custom Universe';
  description: string;
  uploadHistory: UniverseUpload[];
  createdAt: string;
  updatedAt: string;
}
