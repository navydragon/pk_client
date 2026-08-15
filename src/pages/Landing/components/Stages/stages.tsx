import type { FC, CSSProperties } from 'react';

import { useState } from 'react';

import { data } from './lib';

import { Accordion } from '../../../../widgets/Accordion/ui/Accordion';
import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { SendApplicationForm } from '../../../../features/Application/ui/send-application-form';

import styles from './stages.module.scss';

const btnStyle: CSSProperties = {
	margin: 'auto 0 0 0',
	width: '277px',
	height: '56px',
	borderRadius: '8px',
};

export const Stages: FC = () => {
	const [isOpenApplicationForm, setIsOpenApplicationForm] =
		useState<boolean>(false);

	return (
		<section id='stages' className={styles.stages}>
			<div className={styles.column}>
				<h2 className={styles.title}>Как проходит обучение</h2>
				<p className={styles.subtitle}>
					Пошаговый процесс от выбора программы до получения удостоверения
					установленного образца.
				</p>
				<Button
					text='Оставить заявку'
					style={btnStyle}
					color='blue'
					onClick={() => setIsOpenApplicationForm(true)}
				/>
			</div>
			<Accordion items={data} />
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
		</section>
	);
};
