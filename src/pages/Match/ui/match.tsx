import type { FC } from 'react';
import type { IAdvisorFilters, TMatchTab } from '../../../features/Advisor/types/types';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from '../../../store/store';

import { Tabs } from '../../../shared/components/Tabs/ui/tabs';
import { Modal } from '../../../shared/components/Modal/ui/modal';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { Detail } from '../../../widgets/Detail/ui/detail';
import { SendProgramForm } from '../../../features/Application/ui/send-program-form';
import { MatchQuiz } from './match-quiz';
import { MatchChat } from './match-chat';

import {
	getProgramsAction,
	getStreamsAction,
} from '../../../store/landing/actions';
import { setCurrentProgram } from '../../../store/landing/reducer';
import { getAdvisorFilters } from '../../../features/Advisor/lib/helpers';
import { EROUTES } from '../../../shared/utils/routes';

import styles from '../styles/match.module.scss';

export const MatchPage: FC = () => {
	const dispatch = useDispatch();
	const { programs, isLoadingLanding } = useSelector((state) => state.landing);

	const [tab, setTab] = useState<TMatchTab>('quiz');
	const [filters, setFilters] = useState<IAdvisorFilters | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);

	useEffect(() => {
		if (programs.length === 0) {
			dispatch(getProgramsAction());
			dispatch(getStreamsAction());
		}
	}, [dispatch, programs.length]);

	useEffect(() => {
		let cancelled = false;
		getAdvisorFilters()
			.then((data) => {
				if (!cancelled) setFilters(data);
			})
			.catch(() => {
				if (!cancelled) setFilters(null);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const handleOpenDetail = (programId: number, name: string) => {
		dispatch(setCurrentProgram({ id: programId, name }));
		setIsDetailOpen(true);
	};

	const handleCloseDetail = () => {
		dispatch(setCurrentProgram(null));
		setIsDetailOpen(false);
	};

	const handleApply = (programId: number, name: string) => {
		dispatch(setCurrentProgram({ id: programId, name }));
		setIsDetailOpen(false);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		dispatch(setCurrentProgram(null));
		setIsFormOpen(false);
	};

	if (isLoadingLanding && programs.length === 0) {
		return <Preloader />;
	}

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<Link
					to={EROUTES.LANDING}
					className={styles.logo}
					aria-label='На главную'
				/>
				<nav className={styles.nav}>
					<Link className={styles.nav__link} to={`${EROUTES.LANDING}#programs`}>
						Каталог программ
					</Link>
					<Link className={styles.nav__link} to={EROUTES.COMPARE}>
						Сравнение
					</Link>
				</nav>
			</header>

			<main className={styles.main}>
				<h1 className={styles.title}>Подбор программы</h1>
				<p className={styles.subtitle}>
					Ответьте на несколько вопросов или опишите задачу в чате — подберём
					подходящие программы из каталога ДПО.
				</p>

				<div className={styles.toolbar}>
					<Tabs
						tabs={[
							{ label: 'Подбор', path: 'quiz' },
							{ label: 'Чат с консультантом', path: 'chat' },
						]}
						activeTab={tab}
						onTabChange={(path) => setTab(path as TMatchTab)}
					/>
				</div>

				{tab === 'quiz' && (
					<MatchQuiz
						programs={programs}
						filters={filters}
						onOpenDetail={handleOpenDetail}
						onApply={handleApply}
					/>
				)}
				{tab === 'chat' && (
					<MatchChat
						onOpenDetail={handleOpenDetail}
						onApply={handleApply}
					/>
				)}
			</main>

			{isDetailOpen && (
				<Detail
					isOpen={isDetailOpen}
					onClose={handleCloseDetail}
					onOpen={() => {
						setIsDetailOpen(false);
						setIsFormOpen(true);
					}}
				/>
			)}
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
