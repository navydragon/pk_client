import { API_URL } from '../config';

const normalizeErrorToString = (data: any): string => {
	if (!data) return 'Произошла ошибка';

	if (typeof data === 'string') return data;

	if (data.errors && typeof data.errors === 'object') {
		const text = Object.entries(data.errors)
			.map(([field, msg]) => `${field}: ${msg}`)
			.join('\n');

		if (text) return text;
	}

	return (
		data.message || data.error || JSON.stringify(data) || 'Произошла ошибка'
	);
};

const checkResponse = async (res: Response) => {
	let data: any;

	try {
		data = await res.json();
	} catch {
		data = await res.text();
	}

	if (res.ok) return data;

	const message = normalizeErrorToString(data);

	throw new Error(message);
};

export const request = (endpoint: string, options: RequestInit) => {
	const base = API_URL.replace(/\/$/, '');
	const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
	return fetch(`${base}${path}`, options).then(checkResponse);
};
