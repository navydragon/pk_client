import type { FC } from 'react';

import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

import { getCurrentYear } from '../../../../shared/utils/getCurrentYear';
import { EROUTES } from '../../../../shared/utils/routes';

import styles from './footer.module.scss';

export const Footer: FC = () => {
	return (
		<section className={styles.footer}>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.column}>
						<h5 className={styles.title}>О ДПО</h5>
						<p className={styles.text}>
							Институт экономики и финансов Российского университета транспорта
							(МИИТ)
						</p>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='description'
							smooth={true}
							offset={0}
							duration={2500}
							spy={true}>
							Об обучении
						</Link>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='advantages'
							smooth={true}
							offset={0}
							duration={2000}
							spy={true}>
							Возможности и масштабы
						</Link>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='stages'
							smooth={true}
							offset={0}
							duration={1500}
							spy={true}>
							Как проходит обучение
						</Link>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='faq'
							smooth={true}
							offset={0}
							duration={1000}
							spy={true}>
							Часто задаваемые вопросы
						</Link>
					</div>
					<div className={styles.column}>
						<h5 className={styles.title}>Программы</h5>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='programs'
							smooth={true}
							offset={0}
							duration={2000}
							spy={true}>
							Каталог программ
						</Link>
						<Link
							className={`${styles.text} ${styles.text_active}`}
							to='streams'
							smooth={true}
							offset={0}
							duration={1500}
							spy={true}>
							Расписание потоков
						</Link>
						<RouterLink
							className={`${styles.text} ${styles.text_active}`}
							to={EROUTES.COMPARE}>
							Сравнение программ и потоков
						</RouterLink>
						<RouterLink
							className={`${styles.text} ${styles.text_active}`}
							to={EROUTES.MATCH}>
							Подбор программы
						</RouterLink>
					</div>
					<div className={styles.column}>
						<h5 className={styles.title}>Контакты</h5>
						<p className={styles.text}>
							Москва, ул. Новосущевская, дом 22, стр.2
						</p>
						<p className={styles.text}>
							+7 495 274 02 74 доб. 3803 / +7 499 262 40 50
						</p>
						<p className={styles.text}>pk_ief@rut-miit.ru</p>
						<p className={styles.text}>Пн–Пт 9:00–18:00</p>
					</div>
					<div className={styles.column}>
						<h5 className={styles.title}>Документы</h5>
						<a
							className={`${styles.text} ${styles.text_active}`}
							href='https://cloud.mail.ru/public/o6f2/onhrWGbQq'
							target='_blank'
							rel='noreferrer'>
							Лицензия на образовательную деятельность
						</a>
						<a
							className={`${styles.text} ${styles.text_active}`}
							href='https://cloud.mail.ru/public/UX9M/xdwPDwh95'
							target='_blank'
							rel='noreferrer'>
							Приложении к лицензии
						</a>
						<a
							className={`${styles.text} ${styles.text_active}`}
							href='https://cloud.mail.ru/public/YNyc/ehhnsu2T7'
							target='_blank'
							rel='noreferrer'>
							Обработка персональных данных
						</a>
					</div>
				</div>
				<div className={styles.bottom}>
					<p className={styles.copy}>
						&copy; {getCurrentYear()}, Институт экономики и финансов РУТ (МИИТ)
					</p>
				</div>
			</div>
		</section>
	);
};
