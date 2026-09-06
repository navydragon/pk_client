import type { CSSProperties, FC } from 'react';
import type { IAdvisorProgramCard, IRankedProgram } from '../../../features/Advisor/types/types';

import { Button } from '../../../shared/components/Button/ui/button';
import { CompareToggleButton } from '../../../features/Compare/ui/compare-toggle-button';

import styles from '../styles/result-cards.module.scss';

interface IResultCardsProps {
	items: Array<{
		id: number;
		name: string;
		direction?: string;
		format?: string;
		hours?: number;
		duration?: string;
		cost?: string;
		lead?: string;
		score?: number;
		reasons?: string[];
		reason?: string;
	}>;
	onOpenDetail: (programId: number, name: string) => void;
	onApply: (programId: number, name: string) => void;
}

const detailBtn: CSSProperties = {
	width: '140px',
	height: '44px',
	borderRadius: '8px',
};

const applyBtn: CSSProperties = {
	width: '160px',
	height: '44px',
	borderRadius: '8px',
};

const compareBtn: CSSProperties = {
	width: '140px',
	height: '44px',
	borderRadius: '8px',
};

export const mapRankedToCards = (ranked: IRankedProgram[]) =>
	ranked.map((item) => ({
		id: item.program.id,
		name: item.program.name,
		direction: item.program.direction_name,
		format: item.program.learning_format,
		hours: item.program.hours_volume,
		duration: item.program.duration,
		cost: item.program.cost,
		lead: item.program.lead,
		score: item.score,
		reasons: item.reasons,
	}));

export const mapAdvisorToCards = (programs: IAdvisorProgramCard[]) =>
	programs.map((p) => ({
		id: p.id,
		name: p.name,
		direction: p.direction,
		format: p.learning_format,
		hours: p.hours_volume,
		duration: p.duration,
		cost: p.cost,
		lead: p.lead,
		reason: p.reason,
	}));

export const ResultCards: FC<IResultCardsProps> = ({
	items,
	onOpenDetail,
	onApply,
}) => {
	if (items.length === 0) {
		return null;
	}

	return (
		<ul className={styles.list}>
			{items.map((item) => (
				<li className={styles.card} key={item.id}>
					<div className={styles.card__top}>
						{item.direction && (
							<span className={styles.card__tag}>{item.direction}</span>
						)}
						{typeof item.score === 'number' && (
							<span className={styles.card__score}>{item.score}% совпадение</span>
						)}
					</div>
					<h3 className={styles.card__title}>{item.name}</h3>
					{item.lead && <p className={styles.card__lead}>{item.lead}</p>}
					{(item.reasons?.length || item.reason) && (
						<p className={styles.card__why}>
							{item.reason || item.reasons?.join(' · ')}
						</p>
					)}
					<div className={styles.card__meta}>
						{item.hours != null && <span>{item.hours} ак. час.</span>}
						{item.format && <span>{item.format}</span>}
						{item.duration && <span>{item.duration}</span>}
						{item.cost && <span>{item.cost} ₽</span>}
					</div>
					<div className={styles.card__actions}>
						<Button
							text='Подробнее'
							color='blue'
							style={detailBtn}
							onClick={() => onOpenDetail(item.id, item.name)}
						/>
						<Button
							text='Оставить заявку'
							color='outline'
							style={applyBtn}
							onClick={() => onApply(item.id, item.name)}
						/>
						<CompareToggleButton
							type='program'
							id={item.id}
							style={compareBtn}
						/>
					</div>
				</li>
			))}
		</ul>
	);
};
