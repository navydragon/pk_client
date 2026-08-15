import type { FC, CSSProperties, ChangeEvent } from 'react';
import type { IProgram } from '../../../../store/landing/types';

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../store/store';

import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { Select } from '../../../../shared/components/Select/ui/select';
import { Detail } from '../../../../widgets/Detail/ui/detail';
import { SendProgramForm } from '../../../../features/Application/ui/send-program-form';

import { setCurrentProgram } from '../../../../store/landing/reducer';

import styles from './programs.module.scss';

interface IFilterOption {
	id: string;
	name: string;
}

const btnStyle: CSSProperties = {
	margin: '24px 0 0 auto',
	width: '170px',
	height: '56px',
	borderRadius: '8px',
};

const ALL_OPTION: IFilterOption = { id: '', name: 'Выберите' };

const uniqueOptions = (values: string[]): IFilterOption[] => [
	ALL_OPTION,
	...Array.from(new Set(values.filter(Boolean)))
		.sort((a, b) => a.localeCompare(b, 'ru'))
		.map((value) => ({ id: value, name: value })),
];

export const Programs: FC = () => {
	const dispatch = useDispatch();
	const { programs } = useSelector((state) => state.landing);

	const STEP = 6;
	const [visibleCount, setVisibleCount] = useState<number>(STEP);
	const [searchQuery, setSearchQuery] = useState('');
	const [formatFilter, setFormatFilter] = useState<IFilterOption>(ALL_OPTION);
	const [directionFilter, setDirectionFilter] =
		useState<IFilterOption>(ALL_OPTION);
	const [costFilter, setCostFilter] = useState<IFilterOption>(ALL_OPTION);

	const [isOpenProgramForm, setIsOpenProgramForm] = useState<boolean>(false);
	const [isOpenDetailProgram, setIsOpenDetailProgram] =
		useState<boolean>(false);

	const formatOptions = useMemo(
		() => uniqueOptions(programs.map((p) => p.learning_format)),
		[programs]
	);
	const directionOptions = useMemo(
		() => uniqueOptions(programs.map((p) => p.direction_name)),
		[programs]
	);
	const costOptions = useMemo(
		() => uniqueOptions(programs.map((p) => p.cost)),
		[programs]
	);

	const filteredPrograms = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return programs.filter((program) => {
			const matchesSearch =
				!query ||
				program.name.toLowerCase().includes(query) ||
				program.lead.toLowerCase().includes(query);
			const matchesFormat =
				!formatFilter.id || program.learning_format === formatFilter.id;
			const matchesDirection =
				!directionFilter.id || program.direction_name === directionFilter.id;
			const matchesCost = !costFilter.id || program.cost === costFilter.id;
			return matchesSearch && matchesFormat && matchesDirection && matchesCost;
		});
	}, [programs, searchQuery, formatFilter, directionFilter, costFilter]);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + STEP);
	};

	const handleResetFilters = () => {
		setSearchQuery('');
		setFormatFilter(ALL_OPTION);
		setDirectionFilter(ALL_OPTION);
		setCostFilter(ALL_OPTION);
		setVisibleCount(STEP);
	};

	const handleOpenDetail = (program: IProgram) => {
		dispatch(setCurrentProgram(program));
		setIsOpenDetailProgram(true);
	};

	const handleCloseDetail = () => {
		dispatch(setCurrentProgram(null));
		setIsOpenDetailProgram(false);
	};

	const handleOpenModal = () => {
		setIsOpenDetailProgram(false);
		setIsOpenProgramForm(true);
	};

	const handleCloseModal = () => {
		dispatch(setCurrentProgram(null));
		setIsOpenProgramForm(false);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setVisibleCount(STEP);
	};

	const visiblePrograms = filteredPrograms.slice(0, visibleCount);
	const hasMore = visibleCount < filteredPrograms.length;
	const remaining = Math.min(STEP, filteredPrograms.length - visibleCount);

	return (
		<section id='programs' className={styles.programs}>
			<h2 className={styles.title}>Каталог программ</h2>
			<p className={styles.subtitle}>
				Выберите программу по формату, направлению и стоимости.
			</p>

			<div className={styles.container}>
				<aside className={styles.filter}>
					<div className={styles.filter__fields}>
						<label className={styles.filter__field}>
							<span className={styles.filter__label}>Поиск</span>
							<input
								className={styles.filter__input}
								type='text'
								placeholder='Каталог программ'
								value={searchQuery}
								onChange={handleSearchChange}
							/>
						</label>
						<label className={styles.filter__field}>
							<span className={styles.filter__label}>Формат обучения</span>
							<Select
								options={formatOptions}
								currentOption={formatFilter}
								onChooseOption={(option) => {
									setFormatFilter(option);
									setVisibleCount(STEP);
								}}
								placeholder='Выберите'
							/>
						</label>
						<label className={styles.filter__field}>
							<span className={styles.filter__label}>Направление</span>
							<Select
								options={directionOptions}
								currentOption={directionFilter}
								onChooseOption={(option) => {
									setDirectionFilter(option);
									setVisibleCount(STEP);
								}}
								placeholder='Выберите'
							/>
						</label>
						<label className={styles.filter__field}>
							<span className={styles.filter__label}>Стоимость</span>
							<Select
								options={costOptions}
								currentOption={costFilter}
								onChooseOption={(option) => {
									setCostFilter(option);
									setVisibleCount(STEP);
								}}
								placeholder='Выберите'
							/>
						</label>
					</div>
					<button
						type='button'
						className={styles.filter__reset}
						onClick={handleResetFilters}>
						Сбросить фильтры
					</button>
				</aside>

				<div className={styles.content}>
					<ul className={styles.list}>
						{visiblePrograms.map((elem) => (
							<li className={styles.item} key={elem.id}>
								<div className={styles.item__tag}>{elem.direction_name}</div>

								<h4 className={styles.item__title}>{elem.name}</h4>

								<p className={styles.item__text}>{elem.lead}</p>

								<div className={styles.item__info}>
									<span className={styles.item__hours}>
										{elem.hours_volume} ак. час.
									</span>
									<span className={styles.item__form}>
										{elem.learning_format}
									</span>
								</div>

								<Button
									text='Подробнее'
									color='blue'
									style={btnStyle}
									onClick={() => handleOpenDetail(elem)}
								/>
							</li>
						))}
					</ul>

					{filteredPrograms.length === 0 && (
						<p className={styles.empty}>По выбранным фильтрам программ нет</p>
					)}

					{hasMore && (
						<button
							type='button'
							className={styles.button}
							onClick={handleShowMore}>
							Показать ещё {remaining}{' '}
							{remaining === 1
								? 'программу'
								: remaining < 5
									? 'программы'
									: 'программ'}
						</button>
					)}
				</div>
			</div>
			{isOpenDetailProgram && (
				<Detail
					isOpen={isOpenDetailProgram}
					onClose={handleCloseDetail}
					onOpen={handleOpenModal}
				/>
			)}
			{isOpenProgramForm && (
				<Modal
					isOpen={isOpenProgramForm}
					onClose={handleCloseModal}
					title='Отправить заявку'
					description='Специалист отдела повышения квалификации свяжется с вами'>
					<SendProgramForm onSubmit={handleCloseModal} />
				</Modal>
			)}
		</section>
	);
};
