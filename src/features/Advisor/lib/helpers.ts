import type { IProgram } from '../../../store/landing/types';
import type {
	IAdvisorFilters,
	IAdvisorMessage,
	IQuizAnswers,
	IRankedProgram,
} from '../types/types';

import { request } from '../../../shared/api/utils';

export const getAdvisorFilters = (): Promise<IAdvisorFilters> => {
	return request('/advisor/filters/', {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
	});
};

export const sendAdvisorChat = (payload: {
	message: string;
	history: { role: string; content: string }[];
}): Promise<{
	reply: string;
	programs: Array<{
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
	}>;
}> => {
	return request('/advisor/chat/', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	});
};

export const parseCost = (cost: string): number | null => {
	const digits = (cost || '').replace(/[^\d]/g, '');
	if (!digits) return null;
	return Number(digits);
};

export const rankPrograms = (
	programs: IProgram[],
	answers: IQuizAnswers,
	filters: IAdvisorFilters | null
): IRankedProgram[] => {
	const durationOpt = filters?.duration_options.find(
		(o) => o.id === answers.duration
	);
	const budgetOpt = filters?.budget_options.find(
		(o) => o.id === answers.budget
	);

	const ranked = programs.map((program) => {
		let score = 0;
		let maxScore = 0;
		const reasons: string[] = [];

		maxScore += 20;
		if (!answers.programType || answers.programType === 'any') {
			score += 20;
		} else if (program.program_type === answers.programType) {
			score += 20;
			reasons.push(
				program.program_type === 'pp'
					? 'профессиональная переподготовка'
					: 'повышение квалификации'
			);
		}

		maxScore += 25;
		if (!answers.direction || answers.direction === 'any') {
			score += 12;
		} else if (program.direction_name === answers.direction) {
			score += 25;
			reasons.push(program.direction_name);
		}

		maxScore += 20;
		if (!answers.format || answers.format === 'any') {
			score += 10;
		} else if (program.learning_format === answers.format) {
			score += 20;
			reasons.push(program.learning_format);
		}

		maxScore += 15;
		if (!answers.duration || answers.duration === 'any') {
			score += 8;
		} else if (durationOpt?.max_hours == null) {
			if (answers.duration === 'long' && program.hours_volume > 80) {
				score += 15;
				reasons.push(`${program.hours_volume} ак. час.`);
			} else if (answers.duration !== 'long') {
				score += 5;
			}
		} else if (program.hours_volume <= (durationOpt.max_hours || 0)) {
			score += 15;
			reasons.push(`${program.hours_volume} ак. час.`);
		}

		maxScore += 20;
		const costValue = parseCost(program.cost);
		if (!answers.budget || answers.budget === 'any') {
			score += 10;
		} else if (budgetOpt?.max_cost == null) {
			score += 10;
		} else if (costValue == null || costValue <= budgetOpt.max_cost) {
			score += 20;
			reasons.push(
				costValue != null ? `до ${costValue.toLocaleString('ru-RU')} ₽` : 'стоимость по запросу'
			);
		}

		const percent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
		return { program, score: percent, reasons };
	});

	return ranked
		.filter((item) => item.score >= 40)
		.sort((a, b) => b.score - a.score || a.program.name.localeCompare(b.program.name, 'ru'))
		.slice(0, 5);
};

export const loadChatHistory = (): IAdvisorMessage[] => {
	try {
		const raw = sessionStorage.getItem('pk-advisor-chat');
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const saveChatHistory = (messages: IAdvisorMessage[]) => {
	try {
		sessionStorage.setItem('pk-advisor-chat', JSON.stringify(messages.slice(-30)));
	} catch {
		// ignore
	}
};
