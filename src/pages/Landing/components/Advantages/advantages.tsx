import type { FC } from 'react';

import adv1 from '../../../../shared/images/landing/adv-1.png';
import adv2 from '../../../../shared/images/landing/adv-2.png';
import adv3 from '../../../../shared/images/landing/adv-3.png';
import adv4 from '../../../../shared/images/landing/adv-4.png';

import styles from './advantages.module.scss';

const cards = [
	{
		tag: 'Каталог программ',
		title: (
			<>
				50+
				<br />
				программ
			</>
		),
		text: 'по направлениям экономики, управления, финансов и цифровых компетенций',
		image: adv1,
		tone: 'dark' as const,
	},
	{
		tag: 'Слушатели',
		title: <>36 000+ слушателей</>,
		text: 'ежегодно проходят обучение по программам повышения квалификации и профессиональной переподготовки',
		image: adv2,
		tone: 'light' as const,
	},
	{
		tag: 'Опыт',
		title: <>168 000+ специалистов</>,
		text: 'подготовлены за последние годы в рамках программ дополнительного образования',
		image: adv3,
		tone: 'dark' as const,
	},
	{
		tag: 'Корпоративное обучение',
		title: <>Корпоративные заказчики</>,
		text: 'реализация программ для транспортных компаний и организаций других отраслей',
		image: adv4,
		tone: 'dark' as const,
	},
];

export const Advantages: FC = () => {
	return (
		<section id='advantages' className={styles.advantages}>
			<div className={styles.header}>
				<h2 className={styles.title}>
					Возможности и масштабы дополнительного образования
				</h2>
				<p className={styles.subtitle}>
					Широкий выбор программ и большой опыт обучения специалистов и
					корпоративных групп.
				</p>
			</div>
			<ul className={styles.list}>
				{cards.map((card) => (
					<li
						key={card.tag}
						className={`${styles.item} ${
							card.tone === 'light' ? styles.item_light : styles.item_dark
						}`}>
						<div className={styles.item__tag}>{card.tag}</div>
						<div className={styles.item__content}>
							<h3 className={styles.item__title}>{card.title}</h3>
							<p className={styles.item__text}>{card.text}</p>
						</div>
						<div className={styles.item__media} aria-hidden>
							<img className={styles.item__img} src={card.image} alt='' />
						</div>
					</li>
				))}
			</ul>
		</section>
	);
};
