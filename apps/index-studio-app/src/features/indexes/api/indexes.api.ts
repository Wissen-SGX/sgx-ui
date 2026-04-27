import { get, post, put, del } from '@sgx/api-client';

export interface Index {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'building';
  createdAt: string;
  updatedAt: string;
}

export interface CreateIndexPayload {
  name: string;
  description?: string;
}

export interface UpdateIndexPayload {
  name?: string;
  description?: string;
}

export const fetchIndexes = (): Promise<Index[]> =>
  get<Index[]>('/indexes');

export const fetchIndexById = (id: string): Promise<Index> =>
  get<Index>(`/indexes/${id}`);

export const createIndex = (payload: CreateIndexPayload): Promise<Index> =>
  post<Index>('/indexes', payload);

export const updateIndex = (id: string, payload: UpdateIndexPayload): Promise<Index> =>
  put<Index>(`/indexes/${id}`, payload);

export const deleteIndex = (id: string): Promise<void> =>
  del<void>(`/indexes/${id}`);
