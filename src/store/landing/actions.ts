import type { IProgram, IStream, INews, IReview } from './types';
import type {
	IApplication,
	IApplicationWithBranch,
} from '../../features/Application/types/types';
import type { ICorporateRequestPayload } from '../../features/CorporateRequest/types/types';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
	getPrograms,
	getProgramDetail,
	getStreams,
	getNews,
	getReviews,
	subscribe,
	subscribeWithBranch,
	createCorporateRequest,
} from '../../shared/api/landing';

export const getProgramsAction = createAsyncThunk<IProgram[]>(
	'landing/getPrograms',
	getPrograms
);

export const getProgramDetailAction = createAsyncThunk<IProgram, number>(
	'landing/getProgramDetail',
	getProgramDetail
);

export const getStreamsAction = createAsyncThunk<IStream[]>(
	'landing/getStreams',
	getStreams
);

export const subscribeAction = createAsyncThunk<IApplication, IApplication>(
	'landing/subscribe',
	subscribe
);

export const getNewsAction = createAsyncThunk<INews[]>(
	'landing/getNews',
	getNews
);

export const getReviewAction = createAsyncThunk<IReview[]>(
	'landing/getReview',
	getReviews
);

export const subscribeWithBranchAction = createAsyncThunk<
	IApplicationWithBranch,
	IApplicationWithBranch
>('landing/subscribeWithBranch', subscribeWithBranch);

export const createCorporateRequestAction = createAsyncThunk<
	ICorporateRequestPayload,
	ICorporateRequestPayload
>('landing/createCorporateRequest', createCorporateRequest);
