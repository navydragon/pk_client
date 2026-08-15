import type { CSSProperties, FC } from 'react';
import type { IReview } from '../../../../store/landing/types';

import { useMemo, useState } from 'react';
import { Link } from 'react-scroll';
import { useSelector } from '../../../../store/store';

import { Rating } from '../../../../shared/components/Rating/ui/rating';
import { Button } from '../../../../shared/components/Button/ui/button';

import styles from './review.module.scss';

const actionBtnStyle: CSSProperties = {
	width: '277px',
	height: '56px',
	borderRadius: '8px',
};

export const Review: FC = () => {
	const { reviews } = useSelector((state) => state.landing);

	const STEP = 3;
	const [visibleCount, setVisibleCount] = useState<number>(STEP);

	const averageRating = useMemo(() => {
		if (reviews.length === 0) return 0;
		const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
		return Math.round((sum / reviews.length) * 10) / 10;
	}, [reviews]);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + STEP);
	};

	const visibleReviews = reviews.slice(0, visibleCount);
	const hasMore = visibleCount < reviews.length;
	const remaining = Math.min(STEP, reviews.length - visibleCount);

	return (
		reviews.length > 0 && (
			<section id='review' className={styles.review}>
				<div className={styles.header}>
					<div className={styles.header__text}>
						<h2 className={styles.title}>Отзывы слушателей программ</h2>
						<p className={styles.subtitle}>
							Слушатели программ — специалисты транспортной отрасли, органов
							государственной власти и бизнеса. Отзывы отражают практическую
							значимость и результаты обучения.
						</p>
					</div>
					<div className={styles.score}>
						<span className={styles.score__value}>{averageRating}</span>
						<span className={styles.score__label}>
							Средняя оценка по отзывам слушателей
						</span>
					</div>
				</div>

				<div className={styles.container}>
					<ul className={styles.list}>
						{visibleReviews.map((elem: IReview) => (
							<li className={styles.item} key={elem.id}>
								<div className={styles.item__header}>
									<span className={styles.item__rating}>
										<Rating value={elem.rating} />
									</span>
									<div className={styles.item__tag}>Повышение квалификации</div>
								</div>
								<p className={styles.item__text}>«{elem.quote}»</p>
								<h4 className={styles.item__title}>{elem.person_name}</h4>
								<h4 className={styles.item__subtitle}>
									{elem.person_position}
									{elem.company_name ? ` ${elem.company_name}` : ''}
								</h4>
							</li>
						))}
					</ul>

					<div className={styles.actions}>
						{hasMore && (
							<button
								type='button'
								className={styles.button}
								onClick={handleShowMore}>
								Показать ещё {remaining}{' '}
								{remaining === 1
									? 'отзыв'
									: remaining < 5
										? 'отзыва'
										: 'отзывов'}
							</button>
						)}
						<Link
							to='feedback'
							smooth={true}
							offset={0}
							duration={1000}
							spy={true}>
							<Button
								text='Оставить отзыв'
								color='blue'
								style={actionBtnStyle}
							/>
						</Link>
					</div>
				</div>
			</section>
		)
	);
};
