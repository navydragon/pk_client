import type { FC } from 'react';

import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Button } from '../../../shared/components/Button/ui/button';
import { EROUTES } from '../../../shared/utils/routes';
import {
	clearCompare,
	removeBatch,
	removeProgram,
	setCompareTab,
} from '../../../store/compare/reducer';

import styles from '../styles/compare-bar.module.scss';

export const CompareBar: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { programIds, batchIds } = useSelector((state) => state.compare);
	const { programs, streams } = useSelector((state) => state.landing);

	const selectedPrograms = useMemo(
		() => programs.filter((p) => programIds.includes(p.id)),
		[programs, programIds]
	);

	const selectedBatches = useMemo(() => {
		const result: {
			id: number;
			programId: number;
			programName: string;
			label: string;
		}[] = [];
		for (const stream of streams) {
			for (const batch of stream.batches) {
				if (batchIds.includes(batch.id)) {
					result.push({
						id: batch.id,
						programId: stream.id,
						programName: stream.name,
						label: batch.name || stream.name,
					});
				}
			}
		}
		return result;
	}, [streams, batchIds]);

	const total = programIds.length + batchIds.length;
	if (total === 0) {
		return null;
	}

	const isOnComparePage = location.pathname === EROUTES.COMPARE;

	const handleCompare = () => {
		const tab = programIds.length > 0 ? 'programs' : 'batches';
		dispatch(setCompareTab(tab));
		if (!isOnComparePage) {
			navigate(EROUTES.COMPARE);
		}
	};

	return (
		<>
			<div className={styles.spacer} aria-hidden />
			<div className={styles.bar} role='region' aria-label='Список сравнения'>
				<div className={styles.bar__inner}>
					<div className={styles.bar__info}>
						<span className={styles.bar__count}>
							В сравнении: {total}
						</span>
						<ul className={styles.bar__list}>
							{selectedPrograms.map((program) => (
								<li className={styles.bar__item} key={`p-${program.id}`}>
									<span className={styles.bar__tag}>Программа</span>
									<span className={styles.bar__name}>{program.name}</span>
									<button
										type='button'
										className={styles.bar__remove}
										aria-label={`Убрать ${program.name}`}
										onClick={() => dispatch(removeProgram(program.id))}
									/>
								</li>
							))}
							{programIds
								.filter((id) => !selectedPrograms.some((p) => p.id === id))
								.map((id) => (
									<li className={styles.bar__item} key={`p-pending-${id}`}>
										<span className={styles.bar__tag}>Программа</span>
										<span className={styles.bar__name}>Загрузка…</span>
										<button
											type='button'
											className={styles.bar__remove}
											aria-label='Убрать программу'
											onClick={() => dispatch(removeProgram(id))}
										/>
									</li>
								))}
							{selectedBatches.map((batch) => (
								<li className={styles.bar__item} key={`b-${batch.id}`}>
									<span className={styles.bar__tag}>Поток</span>
									<span className={styles.bar__name}>
										{batch.programName}
									</span>
									<button
										type='button'
										className={styles.bar__remove}
										aria-label={`Убрать поток ${batch.label}`}
										onClick={() => dispatch(removeBatch(batch.id))}
									/>
								</li>
							))}
							{batchIds
								.filter((id) => !selectedBatches.some((b) => b.id === id))
								.map((id) => (
									<li className={styles.bar__item} key={`b-pending-${id}`}>
										<span className={styles.bar__tag}>Поток</span>
										<span className={styles.bar__name}>Загрузка…</span>
										<button
											type='button'
											className={styles.bar__remove}
											aria-label='Убрать поток'
											onClick={() => dispatch(removeBatch(id))}
										/>
									</li>
								))}
						</ul>
					</div>
					<div className={styles.bar__actions}>
						{isOnComparePage ? (
							<Link className={styles.bar__link} to='/#programs'>
								К каталогу
							</Link>
						) : null}
						<button
							type='button'
							className={styles.bar__clear}
							onClick={() => dispatch(clearCompare())}>
							Очистить
						</button>
						{!isOnComparePage && (
							<Button
								text='Сравнить'
								color='blue'
								style={{
									width: '140px',
									height: '48px',
									borderRadius: '8px',
								}}
								onClick={handleCompare}
							/>
						)}
						{isOnComparePage &&
							programIds.length > 0 &&
							batchIds.length > 0 && (
								<div className={styles.bar__tabsHint}>
									Выбраны программы и потоки — переключайте вкладки на
									странице
								</div>
							)}
					</div>
				</div>
			</div>
		</>
	);
};
