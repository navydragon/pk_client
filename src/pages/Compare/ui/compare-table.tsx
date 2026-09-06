import type { FC } from 'react';
import type { ICompareRow } from '../lib/helpers';

import styles from '../styles/compare-table.module.scss';

interface ICompareTableProps {
	headers: string[];
	rows: ICompareRow[];
	onlyDifferences: boolean;
	onRemoveColumn: (index: number) => void;
	onApply: (index: number) => void;
	applyDisabled?: boolean[];
}

export const CompareTable: FC<ICompareTableProps> = ({
	headers,
	rows,
	onlyDifferences,
	onRemoveColumn,
	onApply,
	applyDisabled,
}) => {
	const visibleRows = onlyDifferences
		? rows.filter((row) => row.isDifferent)
		: rows;

	if (headers.length === 0) {
		return null;
	}

	return (
		<div className={styles.wrap}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.criterion}>Критерий</th>
						{headers.map((header, index) => (
							<th key={`h-${index}`} className={styles.header}>
								<div className={styles.header__top}>
									<span className={styles.header__title}>{header}</span>
									<button
										type='button'
										className={styles.header__remove}
										aria-label={`Убрать ${header}`}
										onClick={() => onRemoveColumn(index)}
									/>
								</div>
								<button
									type='button'
									className={styles.header__apply}
									disabled={applyDisabled?.[index]}
									onClick={() => onApply(index)}>
									Оставить заявку
								</button>
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{visibleRows.length === 0 ? (
						<tr>
							<td
								className={styles.emptyDiff}
								colSpan={headers.length + 1}>
								Все выбранные варианты совпадают по основным критериям
							</td>
						</tr>
					) : (
						visibleRows.map((row) => (
							<tr
								key={row.key}
								className={
									row.isDifferent ? styles.rowDiff : undefined
								}>
								<td className={styles.criterion}>{row.label}</td>
								{row.values.map((value, index) => (
									<td
										key={`${row.key}-${index}`}
										className={
											row.isDifferent ? styles.cellDiff : undefined
										}>
										{value}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
};
