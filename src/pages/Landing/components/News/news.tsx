import type { FC } from 'react';
import type { INews } from '../../../../store/landing/types';

import { useSelector } from '../../../../store/store';
import { useState } from 'react';

import styles from './news.module.scss';

export const News: FC = () => {
	const { news } = useSelector((state) => state.landing);

	const STEP = 3;
	const [visibleCount, setVisibleCount] = useState<number>(STEP);

	const handleShowMore = () => {
		setVisibleCount((prev) => prev + STEP);
	};

	const visibleNews = news.slice(0, visibleCount);
	const hasMore = visibleCount < news.length;

	return (
		news.length > 0 && (
			<section id='news' className={styles.news}>
				<h2 className={styles.title}>Новости и события</h2>
				<p className={styles.subtitle}>
					Публикации о программах обучения, образовательных проектах,
					профессиональных мероприятиях и развитии компетенций в транспортной
					отрасли.
				</p>

				<div className={styles.container}>
					<ul className={styles.list}>
						{visibleNews.map((elem: INews) => (
							<li className={styles.item} key={elem.id}>
								<div className={styles.item__header}>
									<div className={styles.item__tag}>Мероприятие</div>
									<span className={styles.item__date}>{elem.published_at}</span>
								</div>
								<h4 className={styles.item__title}>{elem.title}</h4>
								<p className={styles.item__text}>{elem.short_description}</p>
								<button type='button' className={styles.detail}>
									Читать &#8594;
								</button>
							</li>
						))}
					</ul>

					{hasMore && (
						<button
							type='button'
							className={styles.button}
							onClick={handleShowMore}>
							Показать ещё {Math.min(STEP, news.length - visibleCount)}{' '}
							{Math.min(STEP, news.length - visibleCount) === 1
								? 'новость'
								: Math.min(STEP, news.length - visibleCount) < 5
									? 'новости'
									: 'новостей'}
						</button>
					)}
				</div>
			</section>
		)
	);
};
