import type { ICompareStore, TCompareTab } from './types';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { COMPARE_LIMIT, COMPARE_STORAGE_KEY } from './types';

const loadPersisted = (): Pick<ICompareStore, 'programIds' | 'batchIds'> => {
	try {
		const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
		if (!raw) {
			return { programIds: [], batchIds: [] };
		}
		const parsed = JSON.parse(raw) as {
			programIds?: number[];
			batchIds?: number[];
		};
		return {
			programIds: Array.isArray(parsed.programIds)
				? parsed.programIds.slice(0, COMPARE_LIMIT)
				: [],
			batchIds: Array.isArray(parsed.batchIds)
				? parsed.batchIds.slice(0, COMPARE_LIMIT)
				: [],
		};
	} catch {
		return { programIds: [], batchIds: [] };
	}
};

const persist = (state: ICompareStore) => {
	try {
		localStorage.setItem(
			COMPARE_STORAGE_KEY,
			JSON.stringify({
				programIds: state.programIds,
				batchIds: state.batchIds,
			})
		);
	} catch {
		// ignore quota / private mode
	}
};

const persisted = loadPersisted();

const initialState: ICompareStore = {
	programIds: persisted.programIds,
	batchIds: persisted.batchIds,
	activeTab: 'programs',
};

export const compareSlice = createSlice({
	name: 'compare',
	initialState,
	reducers: {
		toggleProgram(state, action: PayloadAction<number>) {
			const id = action.payload;
			const index = state.programIds.indexOf(id);
			if (index >= 0) {
				state.programIds.splice(index, 1);
			} else if (state.programIds.length < COMPARE_LIMIT) {
				state.programIds.push(id);
			}
			persist(state);
		},
		toggleBatch(state, action: PayloadAction<number>) {
			const id = action.payload;
			const index = state.batchIds.indexOf(id);
			if (index >= 0) {
				state.batchIds.splice(index, 1);
			} else if (state.batchIds.length < COMPARE_LIMIT) {
				state.batchIds.push(id);
			}
			persist(state);
		},
		removeProgram(state, action: PayloadAction<number>) {
			state.programIds = state.programIds.filter((id) => id !== action.payload);
			persist(state);
		},
		removeBatch(state, action: PayloadAction<number>) {
			state.batchIds = state.batchIds.filter((id) => id !== action.payload);
			persist(state);
		},
		clearCompare(state) {
			state.programIds = [];
			state.batchIds = [];
			persist(state);
		},
		setCompareTab(state, action: PayloadAction<TCompareTab>) {
			state.activeTab = action.payload;
		},
	},
	selectors: {
		getCompareProgramIds: (state) => state.programIds,
		getCompareBatchIds: (state) => state.batchIds,
		getCompareActiveTab: (state) => state.activeTab,
		getCompareCount: (state) => state.programIds.length + state.batchIds.length,
	},
});

export const {
	toggleProgram,
	toggleBatch,
	removeProgram,
	removeBatch,
	clearCompare,
	setCompareTab,
} = compareSlice.actions;

export const {
	getCompareProgramIds,
	getCompareBatchIds,
	getCompareActiveTab,
	getCompareCount,
} = compareSlice.selectors;
