import type { FC } from 'react';

import styles from './description.module.scss';

const items = [
	{
		title: 'Практическая направленность',
		text: 'Мы разрабатываем программы с учётом реальных профессиональных задач, с которыми сталкиваются специалисты в повседневной работе. Обучение строится вокруг прикладных кейсов, инструментов и методик, которые можно использовать сразу после окончания курса.',
	},
	{
		title: 'Актуальные программы',
		text: 'Содержание программ регулярно обновляется с учётом изменений в законодательстве, технологиях и управленческих практиках. Это позволяет слушателям получать знания, соответствующие современным требованиям работодателей и отрасли.',
	},
	{
		title: 'Гибкие форматы обучения',
		text: 'Большинство программ реализуется в онлайн или гибридном формате, что позволяет совмещать обучение с работой. Слушатели получают доступ к учебным материалам и поддержке преподавателей без необходимости отрыва от профессиональной деятельности.',
	},
] as const;

export const Description: FC = () => {
	return (
		<section id='description' className={styles.description}>
			<div className={styles.top}>
				<div className={styles.caption}>
					<span className={styles.caption__point} aria-hidden />
					<p className={styles.caption__text}>О ДПО</p>
				</div>
				<h2 className={styles.title}>
					<span className={styles.title__accent}>
						Мы помогаем развивать профессиональные компетенции,
					</span>
					<span className={styles.title__rest}>
						которые действительно применимы в работе.
					</span>
				</h2>
			</div>

			<ul className={styles.list}>
				{items.map((item) => (
					<li className={styles.item} key={item.title}>
						<h3 className={styles.item__title}>{item.title}</h3>
						<p className={styles.item__text}>{item.text}</p>
					</li>
				))}
			</ul>
		</section>
	);
};
