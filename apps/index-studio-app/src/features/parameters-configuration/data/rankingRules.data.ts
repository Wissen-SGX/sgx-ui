import type { RankingRule } from '../types';

export const initialRankingRules: RankingRule[] = [
  {
    id: 1,
    name: 'Large Cap Ranking',
    primaryFactor: 'Market Cap (SO * Price)',
    rankingFactors: [
      { id: 1, name: 'Market Cap (SO * Price)', order: 'Descending', weightPercentage: 60 },
      { id: 2, name: 'Free-Float (%)', order: 'Descending', weightPercentage: 40 },
    ],
  },
  {
    id: 2,
    name: 'Dividend Leaders',
    primaryFactor: 'Dividend Yield',
    rankingFactors: [
      { id: 1, name: 'Dividend Yield', order: 'Descending', weightPercentage: 70 },
      { id: 2, name: 'Total Return-Y-1', order: 'Descending', weightPercentage: 30 },
    ],
  },
];
