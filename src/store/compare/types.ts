export type TCompareTab = 'programs' | 'batches';

export interface ICompareStore {
	programIds: number[];
	batchIds: number[];
	activeTab: TCompareTab;
}

export const COMPARE_LIMIT = 3;
export const COMPARE_STORAGE_KEY = 'pk-compare';
