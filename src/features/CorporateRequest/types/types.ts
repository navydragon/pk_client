export interface ICorporateRequestPayload {
	organization_name: string;
	contact_name: string;
	contact_position: string;
	phone: string;
	email: string;
	topics: string;
	employees_count: number;
	desired_dates: string;
	comment: string;
}

export interface ICorporateRequestForm {
	organization_name: string;
	contact_name: string;
	contact_position: string;
	phone: string;
	email: string;
	topics: string;
	employees_count: string;
	desired_dates: string;
	comment: string;
	agreement: boolean;
}

export interface ISendCorporateRequestFormProps {
	onSubmit: () => void;
}
