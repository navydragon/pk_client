import type { ChangeEvent, CSSProperties, FC } from 'react';
import type { IStream, IBatch } from '../../../../store/landing/types';

import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../../../store/store';

import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { Select } from '../../../../shared/components/Select/ui/select';
import { SendProgramForm } from '../../../../features/Application/ui/send-program-form';
import { CompareToggleButton } from '../../../../features/Compare/ui/compare-toggle-button';

import {
	setCurrentProgram,
	setCurrentBatch,
} from '../../../../store/landing/reducer';
import { convertDateShort } from '../../../../shared/lib/date';

import styles from './streams.module.scss';

interface IFilterOption {
	id: string;
	name: string;
}

const ALL_OPTION: IFilterOption = { id: '', name: 'Выберите' };

const btnStyle: CSSProperties = {
	width: '180px',
	height: '48px',
	borderRadius: '8px',
	flexShrink: 0,
};

const compareBtnStyle: CSSProperties = {
	width: '140px',
	height: '48px',
	borderRadius: '8px',
	flexShrink: 0,
};

const uniqueOptions = (values: string[]): IFilterOption[] => [
	ALL_OPTION,
	...Array.from(new Set(values.filter(Boolean)))
		.sort((a, b) => a.localeCompare(b, 'ru'))
		.map((value) => ({ id: value, name: value })),
];

export const Streams: FC = () => {
	const dispatch = useDispatch();
	const { streams } = useSelector((state) => state.landing);

	const STEP = 2;
	const [visibleCount, setVisibleCount] = useState<number>(STEP);
	const [searchQuery, setSearchQuery] = useState('');
	const [formatFilter, setFormatFilter] = useState<IFilterOption>(ALL_OPTION);
	const [directionFilter, setDirectionFilter] =
		useState<IFilterOption>(ALL_OPTION);
	const [dateFilter, setDateFilter] = useState<IFilterOption>(ALL_OPTION);

	const [isOpenProgramForm, setIsOpenProgramForm] = useState<boolean>(false);

	const formatOptions = useMemo(() => {
		const formats = streams.flatMap((stream) =>
			stream.batches.map((batch) => batch.learning_format)
		);
		return uniqueOptions(formats);
	}, [streams]);

	const directionOptions = useMemo(
		() => uniqueOptions(streams.map((stream) => stream.direction_name)),
		[streams]
	);

	const dateOptions = useMemo(() => {
		const dates = streams.flatMap((stream) =>
			stream.batches.map((batch) => convertDateShort(batch.start_date))
		);
		return uniqueOptions(dates);
	}, [streams]);

	const filteredStreams = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		return streams
			.map((stream) => {
				const batches = stream.batches.filter((batch) => {
					const matchesFormat =
						!formatFilter.id || batch.learning_format === formatFilter.id;
					const matchesDate =
						!dateFilter.id ||
						convertDateShort(batch.start_date) === dateFilter.id;
					return matchesFormat && matchesDate;
				});
				return { ...stream, batches };
			})
			.filter((stream) => {
				const matchesSearch =
					!query || stream.name.toLowerCase().includes(query);
				const matchesDirection =
					!directionFilter.id || stream.direction_name === directionFilter.id;
				return (
					matchesSearch && matchesDirection && stream.batches.length > 0
				);
			});
	}, [streams, searchQuery, formatFilter, directionFilter, dateFilter]);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + STEP);
	};

	const handleOpenModal = (stream: IStream, batch: IBatch) => {
		const program = { name: stream.name, id: stream.id };
		dispatch(setCurrentProgram(program));
		dispatch(setCurrentBatch(batch));
		setIsOpenProgramForm(true);
	};

	const handleCloseModal = () => {
		dispatch(setCurrentProgram(null));
		dispatch(setCurrentBatch(null));
		setIsOpenProgramForm(false);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setVisibleCount(STEP);
	};

	const visibleStreams = filteredStreams.slice(0, visibleCount);
	const hasMore = visibleCount < filteredStreams.length;
	const remaining = Math.min(STEP, filteredStreams.length - visibleCount);

	const getStreamFormat = (stream: IStream) => {
		const formats = Array.from(
			new Set(stream.batches.map((batch) => batch.learning_format).filter(Boolean))
		);
		return formats[0] || '';
	};

	return (
		streams.length > 0 && (
			<section id='streams' className={styles.streams}>
				<h2 className={styles.title}>Расписание потоков и набор групп</h2>

				<p className={styles.subtitle}>
					Выберите программу и удобные даты начала обучения. Расписание
					обновляется по мере формирования групп.
				</p>

				<div className={styles.filter}>
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
						<span className={styles.filter__label}>Дата начала</span>
						<Select
							options={dateOptions}
							currentOption={dateFilter}
							onChooseOption={(option) => {
								setDateFilter(option);
								setVisibleCount(STEP);
							}}
							placeholder='Выберите'
						/>
					</label>
				</div>

				<ul className={styles.list}>
					{visibleStreams.map((elem) => (
						<li className={styles.item} key={elem.id}>
							<h4 className={styles.item__title}>{elem.name}</h4>

							<ul className={styles.item__tags}>
								<li className={styles.item__tag}>{elem.direction_name}</li>
								<li className={styles.item__tag}>
									{elem.hours_volume} ак. час.
								</li>
								{getStreamFormat(elem) && (
									<li className={styles.item__tag}>{getStreamFormat(elem)}</li>
								)}
							</ul>

							<ul className={styles.parts}>
								{elem.batches.map((batch) => (
									<li className={styles.part} key={batch.id}>
										<div className={styles.part__main}>
											<span className={styles.part__tag}>
												{batch.enrollment_status_text || batch.learning_format}
											</span>

											<p className={styles.part__title}>
												{convertDateShort(batch.start_date)} —{' '}
												{convertDateShort(batch.end_date)}
											</p>
										</div>

										<div className={styles.part__actions}>
											<Button
												text={
													batch.action_button_text ||
													(batch.is_action_enabled
														? 'Записаться'
														: 'Набор завершен')
												}
												color='blue'
												style={btnStyle}
												isBlock={!batch.is_action_enabled}
												onClick={
													batch.is_action_enabled
														? () => handleOpenModal(elem, batch)
														: undefined
												}
											/>
											<CompareToggleButton
												type='batch'
												id={batch.id}
												style={compareBtnStyle}
											/>
										</div>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>

				{filteredStreams.length === 0 && (
					<p className={styles.empty}>По выбранным фильтрам потоков нет</p>
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
		)
	);
};
