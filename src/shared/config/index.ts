export const getApiUrl = (): string => {
	const { hostname } = window.location;

	if (hostname === 'localhost' || hostname === '127.0.0.1') {
		return 'http://127.0.0.1:8000/api';
	}
	return 'https://pk.emiit.ru/api';
};

export const API_URL = getApiUrl();
