import type { FC } from 'react';

import { useDispatch, useSelector } from '../../../../store/store';
import { useNavigate } from 'react-router-dom';

import { courses } from './lib';
import {
	openRegistrationModal,
	closeRegistrationModal,
	getIsRegistrationModalOpen,
} from '../../../../store/uiSlice';

import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { Registration } from '../../../Registration/ui/registration';
import { CourseTag } from './course-tags';

import styles from './course.module.scss';

const btnStyle = {
	padding: '8px 24px',
	width: 'fit-content',
	height: '48px',
};

export const Course: FC = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const isOpenRegistration = useSelector(getIsRegistrationModalOpen);

	const openModal = () => {
		dispatch(openRegistrationModal());
	};

	const closeModal = () => {
		dispatch(closeRegistrationModal());
	};

	const openCourse = (courseId: string) => {
		navigate('/course/' + courseId);
		window.scrollTo(0, 0);
	};

	return (
		<section className={styles.course} id='course'>
			<h2 className={styles.title}>
				Открытые <span className={styles.title_color}>Онлайн-курсы</span>
			</h2>

			<ul className={styles.list}>
				{courses.map((elem) => (
					<li className={styles.card} key={elem.id}>
						<div className={styles.card__top}>
							<img
								className={styles.card__img}
								src={elem.img}
								alt={elem.id}></img>
							<span className={styles.card__hours}>{`${
								elem.active
									? elem.hours + 'ч.'
									: 'statusLabel' in elem && elem.statusLabel
										? elem.statusLabel
										: '#В разработке'
							}`}</span>
						</div>
						<div className={styles.card__bottom}>
							<ul className={styles.card__tags}>
								<CourseTag tags={elem.tags} />
							</ul>
							<h4 className={styles.card__name}>{elem.name}</h4>
							<p className={styles.card__description}>{elem.description}</p>
							<div className={styles.card__buttons}>
								{'promoLinks' in elem && elem.promoLinks ? (
									<>
										<Button
											text='Презентация'
											type='link'
											href={elem.promoLinks.presentation}
											color='blue'
											style={btnStyle}
										/>
										<Button
											text='Видео'
											type='link'
											href={elem.promoLinks.video}
											color='black'
											style={btnStyle}
										/>
									</>
								) : (
									<>
										<Button
											text='Подробнее'
											onClick={() => openCourse(elem.id)}
											color='blue'
											style={btnStyle}
										/>
										{elem.active && (
											<Button
												text='Записаться'
												onClick={() => openModal()}
												color='black'
												style={btnStyle}
											/>
										)}
									</>
								)}
							</div>
						</div>
					</li>
				))}
			</ul>
			{isOpenRegistration && (
				<Modal isOpen={isOpenRegistration} onClose={closeModal}>
					<Registration />
				</Modal>
			)}
		</section>
	);
};
