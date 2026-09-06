import type { FC } from 'react';
import { useState } from 'react';

import { Button } from '../../../../shared/components/Button/ui/button';
import { Modal } from '../../../../shared/components/Modal/ui/modal';
import { SendCorporateRequestForm } from '../../../../features/CorporateRequest/ui/send-corporate-request-form';

import { data } from './lib';

import styles from './company.module.scss';

export const Company: FC = () => {
	const [isOpenCorporateForm, setIsOpenCorporateForm] = useState(false);

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
			<div className={styles.cta}>
				<p className={styles.cta__text}>
					Нужно обучение для команды? Запросите коммерческое предложение —
					подберём программу под задачи вашей организации.
				</p>
				<Button
					text='Запросить КП'
					type='button'
					color='blue'
					onClick={() => setIsOpenCorporateForm(true)}
				/>
			</div>
			<Modal
				isOpen={isOpenCorporateForm}
				onClose={() => setIsOpenCorporateForm(false)}
				title='Запрос коммерческого предложения'
				description='Оставьте контакты организации — менеджер свяжется с вами для подготовки КП.'
				modalWidth='large'>
				<SendCorporateRequestForm
					onSubmit={() => setIsOpenCorporateForm(false)}
				/>
			</Modal>
		</section>
	);
};
