import type { FC, CSSProperties } from 'react';
import type { IDetailProps } from '../types/types';

import ReactDOM from 'react-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store/store';
import { useOnPressEsc } from '../../../hooks/useOnPressEsc';

import { getProgramDetailAction } from '../../../store/landing/actions';

import { ModalOverlay } from '../../../shared/components/Modal/ui/modal-overlay';
import { Button } from '../../../shared/components/Button/ui/button';
import { Preloader } from '../../../shared/components/Preloader/ui/preloader';
import { CompareToggleButton } from '../../../features/Compare/ui/compare-toggle-button';

import styles from '../styles/detail.module.scss';

const btnStyle: CSSProperties = {
	margin: 'auto 0 0 0',
};

const compareBtnStyle: CSSProperties = {
	margin: '12px 0 0 0',
	width: '100%',
	height: '48px',
	borderRadius: '8px',
};

export const Detail: FC<IDetailProps> = ({
	isOpen,
	onClose,
	onOpen,
	closeByClickOutside = true,
	closeByPressEsc = true,
}) => {
	const dispatch = useDispatch();
	const { currentProgram, programDetail, isLoadingDetail } = useSelector(
		(state) => state.landing
	);
	const modalRoot = document.getElementById('modal-root');

	useOnPressEsc(closeByPressEsc ? onClose : undefined);

	const handleOverlayClick = () => {
		if (closeByClickOutside) {
			onClose();
		}
	};

	useEffect(() => {
		if (currentProgram) {
			dispatch(getProgramDetailAction(currentProgram.id));
		}
	}, [dispatch, currentProgram]);

	if (isLoadingDetail) {
		return <Preloader />;
	}

	const modalContent = (
		<div className={`${styles.detail} ${isOpen ? styles.detail_opened : ''}`}>
			{isOpen && <ModalOverlay onClick={handleOverlayClick} />}
			{programDetail && (
				<div className={styles.container}>
					<div className={styles.main}>
						<div className={styles.main__header}>
							<div className={styles.main__tag}>
								{programDetail.direction_name}
							</div>
						</div>
						<h2 className={styles.main__title}>{programDetail.name}</h2>
						<p className={styles.main__subtitle}>{programDetail.lead}</p>
						<ul className={styles.main__list}>
							<li className={styles.main__item}>
								<div
									className={`${styles.main__icon} ${styles.main__icon_type_hours}`}></div>
								<h6 className={styles.main__item_title}>Объем:</h6>
								<p className={styles.main__item_text}>
									{programDetail.hours_volume} ак. час.
								</p>
							</li>
							<li className={styles.main__item}>
								<div
									className={`${styles.main__icon} ${styles.main__icon_type_form}`}></div>
								<h6 className={styles.main__item_title}>Форма:</h6>
								<p className={styles.main__item_text}>
									{programDetail.learning_format}
								</p>
							</li>
							<li className={styles.main__item}>
								<div
									className={`${styles.main__icon} ${styles.main__icon_type_duration}`}></div>
								<h6 className={styles.main__item_title}>Срок:</h6>
								<p className={styles.main__item_text}>
									{programDetail.duration}
								</p>
							</li>
							<li className={styles.main__item}>
								<div
									className={`${styles.main__icon} ${styles.main__icon_type_cost}`}></div>
								<h6 className={styles.main__item_title}>Стоимость:</h6>
								<p className={styles.main__item_text}>
									{programDetail.cost} &#8381;
								</p>
							</li>
						</ul>
						<Button
							text='Оставить заявку'
							style={btnStyle}
							color='blue'
							onClick={onOpen}
						/>
						{programDetail && (
							<CompareToggleButton
								type='program'
								id={programDetail.id}
								style={compareBtnStyle}
							/>
						)}
					</div>
					<div className={styles.info}>
						<div className={styles.info__header}>
							<div className={styles.info__tag}>
								{programDetail.program_type === 'pp'
									? 'Профессиональная переподготовка'
									: 'Повышение квалификации'}
							</div>
							<button
								className={styles.close}
								type='button'
								onClick={onClose}></button>
						</div>
						<h3 className={styles.info__title}>Подробнее о программе</h3>
						<div className={styles.info__item}>
							<h4 className={styles.info__subtitle}>Краткая аннотация</h4>
							<p className={styles.info__text}>
								{programDetail.about_description}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);

	return ReactDOM.createPortal(modalContent, modalRoot || document.body);
};
