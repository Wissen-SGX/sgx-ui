export enum JobStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DRAFT = 'DRAFT',
}

export enum IndexType {
  STANDARD_INDEX = 'STANDARD_INDEX',
  FIXED_BASKET_EQUAL_WEIGHT = 'FIXED_BASKET_EQUAL_WEIGHT',
  FIXED_BASKET_FREE_FLOAT = 'FIXED_BASKET_FREE_FLOAT',
  INDEX_OF_INDICES = 'INDEX_OF_INDICES',
}

export const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Queued', value: JobStatus.QUEUED },
  { label: 'Running', value: JobStatus.RUNNING },
  { label: 'Completed', value: JobStatus.COMPLETED },
  { label: 'Failed', value: JobStatus.FAILED },
  { label: 'Draft', value: JobStatus.DRAFT },
];

export const TYPE_OPTIONS = [
  { label: 'All Types', value: 'ALL' },
  { label: 'Standard Index', value: IndexType.STANDARD_INDEX },
  { label: 'Fixed Basket (Equal Weight)', value: IndexType.FIXED_BASKET_EQUAL_WEIGHT },
  { label: 'Fixed Basket (Free Float)', value: IndexType.FIXED_BASKET_FREE_FLOAT },
  { label: 'Index of Indices', value: IndexType.INDEX_OF_INDICES },
];
