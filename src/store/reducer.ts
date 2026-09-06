import { combineSlices } from '@reduxjs/toolkit';
import { userSlice } from './user/reducer';
import { catalogSlice } from './catalog/reducer';
import { applicationSlice } from './application/reducer';
import { coordinationSlice } from './coordination/reducer';
import { structureSlice } from './structure/reducer';
import { historySlice } from './history/reducer';
import { controlApproveSlice } from './control-approve/reducer';
import { programsSlice } from './landing/reducer';
import { compareSlice } from './compare/reducer';
import { uiSlice } from './uiSlice';

export const rootReducer = combineSlices(
	userSlice,
	catalogSlice,
	applicationSlice,
	coordinationSlice,
	structureSlice,
	historySlice,
	controlApproveSlice,
	programsSlice,
	compareSlice,
	uiSlice
);
