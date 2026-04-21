export interface FilterRule {
  id: number;
  field: string;
  operator: string;
  value: string;
  enabled: boolean;
  appliedToIndex?: string;
}

export interface FilterSet {
  id: number;
  name: string;
  description: string;
  filters: FilterRule[];
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}
