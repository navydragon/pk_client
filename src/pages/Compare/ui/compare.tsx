import type { FC } from 'react';
import type { TCompareTab } from '../../../store/compare/types';

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { SendProgramForm } from '../../../features/Application/ui/send-program-form';
import { CompareTable } from './compare-table';

import {
	getProgramsAction,
	getStreamsAction,
} from '../../../store/landing/actions';
import {
	setCurrentBatch,
	setCurrentProgram,
} from '../../../store/landing/reducer';
import {
	removeBatch,
	removeProgram,
	setCompareTab,
} from '../../../store/compare/reducer';
import { EROUTES } from '../../../shared/utils/routes';
import {
	buildBatchCompareRows,
	buildProgramCompareRows,
	collectBatches,
} from '../lib/helpers';

import styles from '../styles/compare.module.scss';

export const ComparePage: FC = () => {
	const dispatch = useDispatch();
	const { programIds, batchIds, activeTab } = useSelector(
		(state) => state.compare
	);
	const { programs, streams, isLoadingLanding } = useSelector(
		(state) => state.landing
	);

	const [onlyDifferences, setOnlyDifferences] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);

	useEffect(() => {
		if (programs.length === 0 || streams.length === 0) {
			dispatch(getProgramsAction());
			dispatch(getStreamsAction());
		}
	}, [dispatch, programs.length, streams.length]);

	useEffect(() => {
		if (activeTab === 'programs' && programIds.length === 0 && batchIds.length > 0) {
			dispatch(setCompareTab('batches'));
		}
		if (activeTab === 'batches' && batchIds.length === 0 && programIds.length > 0) {
			dispatch(setCompareTab('programs'));
		}
	}, [activeTab, programIds.length, batchIds.length, dispatch]);

	const selectedPrograms = useMemo(
		() =>
			programIds
				.map((id) => programs.find((p) => p.id === id))
				.filter((p): p is NonNullable<typeof p> => Boolean(p)),
		[programs, programIds]
	);

	const selectedBatches = useMemo(
		() => collectBatches(streams, batchIds),
		[streams, batchIds]
	);

	const programRows = useMemo(
		() => buildProgramCompareRows(selectedPrograms, streams),
		[selectedPrograms, streams]
	);

	const batchRows = useMemo(
		() => buildBatchCompareRows(selectedBatches),
		[selectedBatches]
	);

	const tabs = [
		{
			label: 'Программы',
			path: 'programs',
			count: programIds.length || undefined,
			disabled: programIds.length === 0,
		},
		{
			label: 'Потоки',
			path: 'batches',
			count: batchIds.length || undefined,
			disabled: batchIds.length === 0,
		},
	];

	const handleTabChange = (path: string) => {
		dispatch(setCompareTab(path as TCompareTab));
	};

	const handleApplyProgram = (index: number) => {
		const program = selectedPrograms[index];
		if (!program) return;
		dispatch(setCurrentProgram({ id: program.id, name: program.name }));
		dispatch(setCurrentBatch(null));
		setIsFormOpen(true);
	};

	const handleApplyBatch = (index: number) => {
		const item = selectedBatches[index];
		if (!item) return;
		dispatch(
			setCurrentProgram({ id: item.programId, name: item.programName })
		);
		dispatch(setCurrentBatch(item.batch));
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		dispatch(setCurrentProgram(null));
		dispatch(setCurrentBatch(null));
		setIsFormOpen(false);
	};

	const isEmpty = programIds.length === 0 && batchIds.length === 0;

	if (isLoadingLanding && programs.length === 0) {
		return <Preloader />;
	}

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<Link to={EROUTES.LANDING} className={styles.logo} aria-label='На главную' />
				<nav className={styles.nav}>
					<Link className={styles.nav__link} to={`${EROUTES.LANDING}#programs`}>
						Каталог программ
					</Link>
					<Link className={styles.nav__link} to={`${EROUTES.LANDING}#streams`}>
						Расписание потоков
					</Link>
				</nav>
			</header>

			<main className={styles.main}>
				<h1 className={styles.title}>Сравнение программ и потоков</h1>
				<p className={styles.subtitle}>
					Сопоставьте до трёх программ или потоков по ключевым параметрам
					и оставьте заявку на подходящий вариант.
				</p>

				{isEmpty ? (
					<div className={styles.empty}>
						<p className={styles.empty__text}>
							Вы ещё ничего не добавили к сравнению. Откройте каталог
							и нажмите «Сравнить» на карточках программ или потоков.
						</p>
						<Link className={styles.empty__link} to={`${EROUTES.LANDING}#programs`}>
							Перейти в каталог
						</Link>
					</div>
				) : (
					<>
						<div className={styles.toolbar}>
							<Tabs
								tabs={tabs}
								activeTab={activeTab}
								onTabChange={handleTabChange}
							/>
							<label className={styles.diffToggle}>
								<input
									type='checkbox'
									checked={onlyDifferences}
									onChange={(e) => setOnlyDifferences(e.target.checked)}
								/>
								<span>Только отличия</span>
							</label>
						</div>

						{activeTab === 'programs' && selectedPrograms.length > 0 && (
							<CompareTable
								headers={selectedPrograms.map((p) => p.name)}
								rows={programRows}
								onlyDifferences={onlyDifferences}
								onRemoveColumn={(index) =>
									dispatch(removeProgram(selectedPrograms[index].id))
								}
								onApply={handleApplyProgram}
							/>
						)}

						{activeTab === 'batches' && selectedBatches.length > 0 && (
							<CompareTable
								headers={selectedBatches.map(
									(item) =>
										item.batch.name ||
										`${item.programName} · поток`
								)}
								rows={batchRows}
								onlyDifferences={onlyDifferences}
								onRemoveColumn={(index) =>
									dispatch(removeBatch(selectedBatches[index].batch.id))
								}
								onApply={handleApplyBatch}
								applyDisabled={selectedBatches.map(
									(item) => !item.batch.is_action_enabled
								)}
							/>
						)}

						{activeTab === 'programs' &&
							programIds.length > 0 &&
							selectedPrograms.length === 0 && (
								<p className={styles.pending}>
									Загрузка выбранных программ…
								</p>
							)}

						{activeTab === 'batches' &&
							batchIds.length > 0 &&
							selectedBatches.length === 0 && (
								<p className={styles.pending}>
									Загрузка выбранных потоков… Если потоки устарели,
									уберите их из сравнения и выберите актуальные.
								</p>
							)}
					</>
				)}
			</main>

			{isFormOpen && (
				<Modal
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					title='Отправить заявку'
					description='Специалист отдела повышения квалификации свяжется с вами'>
					<SendProgramForm onSubmit={handleCloseForm} />
				</Modal>
			)}
		</div>
	);
};
