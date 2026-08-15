import type { FC } from 'react';

import { data } from './lib';

import styles from './company.module.scss';

export const Company: FC = () => {
	return (
		<section id='company' className={styles.company}>
			<div className={styles.caption}>
				<div className={styles.caption__point}></div>
				<p className={styles.caption__text}>
					Обучаем специалистов для компаний разных отраслей
				</p>
			</div>
			<ul className={styles.list}>
				{data.map((elem) => (
					<li key={elem.id} className={styles.item}>
						<img className={styles.img} src={elem.img} alt=''></img>
					</li>
				))}
			</ul>
		</section>
	);
};
