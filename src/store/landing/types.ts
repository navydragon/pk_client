export interface ILandingStore {
	programs: IProgram[];
	streams: IStream[];
	news: INews[];
	reviews: IReview[];
	programDetail: IProgram | null;
	currentProgram: { name: string; id: number } | null;
	currentBatch: IBatch | null;
	isLoadingLanding: boolean;
	isLoadingAction: boolean;
	isLoadingDetail: boolean;
	error: string | null;
}

export interface IProgram {
	id: number;
	name: string;
	about_description: string;
	cost: string;
	curriculum: string;
	direction: number;
	direction_name: string;
	duration: string;
	enrollment_process: string;
	hours_volume: number;
	lead: string;
	learning_format: string;
	program_type: 'pk' | 'pp';
	outcome: string;
	requirements: string;
	status: string;
	target_audience: string;
	training_direction_code: string;
}

export interface IStream {
	direction_name: string;
	hours_volume: number;
	id: number;
	name: string;
	batches: IBatch[];
}

export interface IBatch {
	action_button_text: string;
	cost: string;
	end_date: string;
	enrollment_status_text: string;
	id: number;
	is_action_enabled: boolean;
	learning_format: string;
	name?: string;
	schedule?: string;
	seats_count?: number | null;
	start_date: string;
	status: string;
}

export interface INews {
	id: number;
	type: string;
	title: string;
	slug: string;
	short_description: string;
	main_image_url: string;
	published_at: string;
	is_featured: boolean;
}

export interface IReview {
	id: number;
	person_name: string;
	person_position: string;
	company_name: string;
	quote: string;
	rating: number;
	is_featured: boolean;
	created_at: string;
}
