import type {
	IApplication,
	IApplicationWithBranch,
} from '../../features/Application/types/types';
import type { ICorporateRequestPayload } from '../../features/CorporateRequest/types/types';

import { request } from './utils';

export const getPrograms = () => {
	return request('/active-programs/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const getProgramDetail = (id: number) => {
	return request(`/programs/${id}/`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const getStreams = () => {
	return request('/programs-with-batches/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const subscribe = (data: IApplication) => {
	return request('/callback-requests/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: data.name,
			phone: data.phone,
			email: data.email,
		}),
	});
};

export const subscribeWithBranch = (data: IApplicationWithBranch) => {
	return request('/applications/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			full_name: data.full_name,
			program: data.program,
			batch: data.batch,
			email: data.email,
			phone: data.phone,
			comment: data.comment,
		}),
	});
};

export const createCorporateRequest = (data: ICorporateRequestPayload) => {
	return request('/corporate-requests/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
};

export const getNews = () => {
	return request('/publications/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const getReviews = () => {
	return request('/testimonials/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};
