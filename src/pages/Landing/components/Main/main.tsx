import type { CSSProperties, FC } from 'react';

import { useState } from 'react';
import { Link } from 'react-scroll';

import { Header } from '../Header/header';
import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { SendApplicationForm } from '../../../../features/Application/ui/send-application-form';

import beaverImg from '../../../../shared/images/landing/beaver.png';
import ovalImg from '../../../../shared/images/landing/skills-oval.svg';

import styles from './main.module.scss';

const ctaStyle: CSSProperties = {
	width: '277px',
	maxWidth: '100%',
	height: '56px',
	borderRadius: '8px',
	flexShrink: 1,
};

export const Main: FC = () => {
	const [isOpenConsultForm, setIsOpenConsultForm] = useState<boolean>(false);

	return (
		<section className={styles.main}>
			<div className={styles.headerWrap}>
				<Header />
			</div>

			<div className={styles.hero}>
				<h1 className={styles.title}>
					<span className={styles.title__row}>
						<span className={styles.title__accent}>Развивайте </span>
						<span className={styles.title__skills}>
							<span className={styles.title__accent}>навыки,</span>
							<img
								className={styles.title__oval}
								src={ovalImg}
								alt=''
								aria-hidden
							/>
						</span>
					</span>
					<span className={styles.title__row}>
						которые востребованы на рынке
					</span>
				</h1>

				<span className={`${styles.badge} ${styles.badge_topLeft}`}>
					Онлайн и очное обучение
				</span>
				<span className={`${styles.badge} ${styles.badge_middleRight}`}>
					Удостоверение государственного образца
				</span>
				<span className={`${styles.badge} ${styles.badge_bottomRight}`}>
					Обучение от 2-х недель
				</span>

				<div className={styles.mascot} aria-hidden>
					<img className={styles.mascot__img} src={beaverImg} alt='' />
				</div>

				<p className={styles.subtitle}>
					Программы повышения квалификации и профессиональной переподготовки
					от&nbsp;Института экономики и&nbsp;финансов РУТ&nbsp;(МИИТ)
					для&nbsp;сотрудников транспортных компаний, организаций других отраслей
					и&nbsp;частных лиц.
				</p>

				<div className={styles.buttons}>
					<Button
						text='Получить консультацию'
						color='blue'
						style={{
							...ctaStyle,
							background: '#005CC9',
							borderColor: '#005CC9',
						}}
						onClick={() => setIsOpenConsultForm(true)}
					/>
					<Link
						to='programs'
						smooth={true}
						offset={0}
						duration={1500}
						spy={true}>
						<Button text='Подобрать программу' color='blue' style={ctaStyle} />
					</Link>
				</div>
			</div>

			{isOpenConsultForm && (
				<Modal
					isOpen={isOpenConsultForm}
					onClose={() => setIsOpenConsultForm(false)}
					title='Отправить заявку'
					description='Специалист отдела повышения квалификации свяжется с вами'>
					<SendApplicationForm onSubmit={() => setIsOpenConsultForm(false)} />
				</Modal>
			)}
		</section>
	);
};
