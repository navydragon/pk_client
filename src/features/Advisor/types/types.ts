import type { IProgram } from '../../../store/landing/types';

export type TMatchTab = 'quiz' | 'chat';

export interface IQuizAnswers {
	programType: string;
	direction: string;
	format: string;
	duration: string;
	budget: string;
}

export interface IRankedProgram {
	program: IProgram;
	score: number;
	reasons: string[];
}

export interface IAdvisorMessage {
	role: 'user' | 'assistant';
	content: string;
	programs?: IAdvisorProgramCard[];
}

export interface IAdvisorProgramCard {
	id: number;
	name: string;
	direction?: string;
	program_type_label?: string;
	learning_format?: string;
	hours_volume?: number;
	duration?: string;
	cost?: string;
	lead?: string;
	reason?: string;
}

export interface IFilterOption {
	id: string;
	name: string;
	max_hours?: number | null;
	max_cost?: number | null;
}

export interface IAdvisorFilters {
	directions: IFilterOption[];
	formats: IFilterOption[];
	program_types: IFilterOption[];
	duration_options: IFilterOption[];
	budget_options: IFilterOption[];
}

export const emptyQuizAnswers = (): IQuizAnswers => ({
	programType: '',
	direction: '',
	format: '',
	duration: '',
	budget: '',
});

export const CHAT_STORAGE_KEY = 'pk-advisor-chat';
