import type { FC } from 'react';

import { useState } from 'react';

import { Link } from 'react-scroll';

import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { SendApplicationForm } from '../../../../features/Application/ui/send-application-form';

import styles from './header.module.scss';

const navItems = [
	{ to: 'description', label: 'О ДПО' },
	{ to: 'advantages', label: 'Возможности' },
	{ to: 'programs', label: 'Программы' },
	{ to: 'company', label: 'Заказчики' },
	{ to: 'stages', label: 'Этапы обучения' },
	{ to: 'faq', label: 'Частые вопросы' },
] as const;

const ctaStyle = {
	width: '100%',
	maxWidth: '277px',
	height: '58px',
	borderRadius: '8px',
};

export const Header: FC = () => {
	const [isOpenApplicationForm, setIsOpenApplicationForm] =
		useState<boolean>(false);

	return (
		<div className={styles.header}>
			<div className={styles.logo} aria-label='ИЭФ РУТ'></div>
			<nav className={styles.nav}>
				<ul className={styles.nav__list}>
					{navItems.map((item, index) => (
						<Link
							key={item.to}
							className={`${styles.nav__item}${
								index === 0 ? ` ${styles.nav__item_accent}` : ''
							}`}
							activeClass={styles.nav__item_active}
							to={item.to}
							smooth={true}
							offset={0}
							duration={500}
							spy={true}>
							{item.label}
						</Link>
					))}
				</ul>
			</nav>
			<Button
				text='Оставить заявку'
				color='blue'
				style={ctaStyle}
				onClick={() => setIsOpenApplicationForm(true)}
			/>
			{isOpenApplicationForm && (
				<Modal
					isOpen={isOpenApplicationForm}
					onClose={() => setIsOpenApplicationForm(false)}
					title='Отправить заявку'
					description='Специалист отдела повышения квалификации свяжется с вами'>
					<SendApplicationForm
						onSubmit={() => setIsOpenApplicationForm(false)}
					/>
				</Modal>
			)}
		</div>
	);
};
