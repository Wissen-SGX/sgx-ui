export interface GeneratedFile {
  id: number;
  fileName: string;
  generatedAt: string;
  fileSize: string;
  status: 'Processing' | 'Completed' | 'Failed';
}

export interface UniverseConfiguration {
  id: number;
  name: string;
  universeId: number;
  filterSetId: number;
  reviewDate: string;
  frequency: string;
  status: 'Draft' | 'Running' | 'Completed' | 'Failed';
  createdBy: string;
  createdAt: string;
  generatedFiles: GeneratedFile[];
}
