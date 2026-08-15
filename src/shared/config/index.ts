export const getApiUrl = (): string => {
	const { hostname } = window.location;

	if (hostname === 'localhost') {
		return 'https://pk.emiit.ru/api/';
	} else {
		return 'https://pk.emiit.ru/api/';
	}
};

export const API_URL = getApiUrl();
