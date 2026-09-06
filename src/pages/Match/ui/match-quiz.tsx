import type { FC } from 'react';
import type {
	IAdvisorFilters,
	IQuizAnswers,
	IRankedProgram,
} from '../../../features/Advisor/types/types';
import type { IProgram } from '../../../store/landing/types';

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { EROUTES } from '../../../shared/utils/routes';
import { rankPrograms } from '../../../features/Advisor/lib/helpers';
import { mapRankedToCards, ResultCards } from './result-cards';

import styles from '../styles/quiz.module.scss';

interface IMatchQuizProps {
	programs: IProgram[];
	filters: IAdvisorFilters | null;
	onOpenDetail: (programId: number, name: string) => void;
	onApply: (programId: number, name: string) => void;
}

const STEPS = [
	{
		key: 'programType' as const,
		title: 'Какая цель обучения?',
		hint: 'Повышение квалификации или переподготовка',
	},
	{
		key: 'direction' as const,
		title: 'Какое направление интересно?',
		hint: 'Можно выбрать «Не важно»',
	},
	{
		key: 'format' as const,
		title: 'Какой формат удобнее?',
		hint: 'Очный, онлайн или смешанный',
	},
	{
		key: 'duration' as const,
		title: 'Сколько готовы учиться?',
		hint: 'Ориентир по объёму программы',
	},
	{
		key: 'budget' as const,
		title: 'Какой бюджет?',
		hint: 'Отфильтруем по стоимости',
	},
];

export const MatchQuiz: FC<IMatchQuizProps> = ({
	programs,
	filters,
	onOpenDetail,
	onApply,
}) => {
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<IQuizAnswers>({
		programType: '',
		direction: '',
		format: '',
		duration: '',
		budget: '',
	});
	const [finished, setFinished] = useState(false);

	const current = STEPS[step];

	const options = useMemo(() => {
		if (!filters) return [];
		const stepKey = current.key as keyof IQuizAnswers;
		switch (stepKey) {
			case 'programType':
				return [
					...filters.program_types,
					{ id: 'any', name: 'Не важно' },
				];
			case 'direction':
				return [
					...filters.directions.map((d) => ({ id: d.name, name: d.name })),
					{ id: 'any', name: 'Не важно' },
				];
			case 'format':
				return [
					...filters.formats.map((f) => ({ id: f.name, name: f.name })),
					{ id: 'any', name: 'Не важно' },
				];
			case 'duration':
				return filters.duration_options;
			case 'budget':
				return filters.budget_options;
			default: {
				const _exhaustive: never = stepKey;
				void _exhaustive;
				return [];
			}
		}
	}, [current.key, filters]);

	const ranked: IRankedProgram[] = useMemo(
		() => (finished ? rankPrograms(programs, answers, filters) : []),
		[finished, programs, answers, filters]
	);

	const handleChoose = (optionId: string) => {
		const nextAnswers = { ...answers, [current.key]: optionId };
		setAnswers(nextAnswers);
		if (step < STEPS.length - 1) {
			setStep((prev) => prev + 1);
		} else {
			setFinished(true);
		}
	};

	const handleReset = () => {
		setStep(0);
		setAnswers({
			programType: '',
			direction: '',
			format: '',
			duration: '',
			budget: '',
		});
		setFinished(false);
	};

	const progress = finished
		? 100
		: Math.round(((step + (answers[current.key] ? 1 : 0)) / STEPS.length) * 100);

	if (finished) {
		return (
			<div className={styles.wrap}>
				<div className={styles.resultHead}>
					<h2 className={styles.stepTitle}>Подходящие программы</h2>
					<button type='button' className={styles.linkBtn} onClick={handleReset}>
						Пройти заново
					</button>
				</div>
				{ranked.length === 0 ? (
					<div className={styles.empty}>
						<p>
							По выбранным условиям программ не нашлось. Ослабьте фильтры
							или посмотрите весь каталог.
						</p>
						<Link className={styles.catalogLink} to={`${EROUTES.LANDING}#programs`}>
							К каталогу
						</Link>
					</div>
				) : (
					<ResultCards
						items={mapRankedToCards(ranked)}
						onOpenDetail={onOpenDetail}
						onApply={onApply}
					/>
				)}
			</div>
		);
	}

	return (
		<div className={styles.wrap}>
			<div className={styles.progress}>
				<div className={styles.progress__bar} style={{ width: `${progress}%` }} />
			</div>
			<p className={styles.stepMeta}>
				Шаг {step + 1} из {STEPS.length}
			</p>
			<h2 className={styles.stepTitle}>{current.title}</h2>
			<p className={styles.stepHint}>{current.hint}</p>

			<ul className={styles.options}>
				{options.map((option) => (
					<li key={option.id}>
						<button
							type='button'
							className={`${styles.option}${
								answers[current.key] === option.id ? ` ${styles.option_active}` : ''
							}`}
							onClick={() => handleChoose(option.id)}>
							{option.name}
						</button>
					</li>
				))}
			</ul>

			<div className={styles.nav}>
				{step > 0 && (
					<button
						type='button'
						className={styles.linkBtn}
						onClick={() => setStep((prev) => prev - 1)}>
						Назад
					</button>
				)}
				<button type='button' className={styles.linkBtn} onClick={handleReset}>
					Сбросить
				</button>
			</div>
		</div>
	);
};
