import type { FormulaField } from '../types';

export const initialFormulaFields: FormulaField[] = [
  {
    id: 1,
    fieldName: 'Market Cap',
    description: 'Total market capitalization calculated from shares outstanding and price',
    formula: 'Shares Outstanding * Current Price',
    createdBy: 'John Smith',
    createdAt: '2024-01-15 10:30 AM',
    modifiedBy: 'John Smith',
    modifiedAt: '2024-01-15 10:30 AM',
  },
  {
    id: 2,
    fieldName: 'P/E Ratio',
    description: 'Price to Earnings ratio',
    formula: 'Current Price / Earnings Per Share',
    createdBy: 'Sarah Johnson',
    createdAt: '2024-02-10 02:15 PM',
    modifiedBy: 'Sarah Johnson',
    modifiedAt: '2024-02-10 02:15 PM',
  },
];
