import type { FC, FormEvent } from 'react';
import type {
	ISendCorporateRequestFormProps,
	ICorporateRequestForm,
} from '../types/types';

import { useForm } from '../../../hooks/useForm';
import { useDispatch } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Form } from '../../../shared/components/Form/ui/form';
import {
	FormField,
	FormInput,
} from '../../../shared/components/Form/components';
import { Button } from '../../../shared/components/Button/ui/button';
import { Checkbox } from '../../../shared/components/Checkbox/ui/checkbox';

import {
	validationSchema,
	initialFormValues,
	shouldBlockSubmit,
} from '../lib/helpers';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { createCorporateRequestAction } from '../../../store/landing/actions';

import styles from '../styles/send-corporate-request-form.module.scss';

export const SendCorporateRequestForm: FC<ISendCorporateRequestFormProps> = ({
	onSubmit,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { values, handleChange, handleCheckboxToggle, errors } =
		useForm<ICorporateRequestForm>(initialFormValues, validationSchema);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (isBlockSubmit) {
			return;
		}

		const data = {
			organization_name: values.organization_name.trim(),
			contact_name: values.contact_name.trim(),
			contact_position: values.contact_position.trim(),
			phone: values.phone.trim(),
			email: values.email.trim(),
			topics: values.topics.trim(),
			employees_count: Number(values.employees_count),
			desired_dates: values.desired_dates.trim(),
			comment: values.comment.trim(),
		};

		try {
			await dispatch(createCorporateRequestAction(data)).unwrap();
			onSubmit();
			showToast({
				title: 'Отправлено',
				text: 'Запрос коммерческого предложения принят. Менеджер свяжется с вами в рабочее время.',
				type: 'success',
			});
		} catch (err) {
			showToast({
				title: 'Ошибка при отправке запроса',
				text: getErrorMessage(err),
				type: 'error',
			});
		}
	};

	const isBlockSubmit = shouldBlockSubmit(values, errors);

	return (
		<div className={styles.container}>
			<div className={styles.form}>
				<Form
					name='send-corporate-request-form'
					onSubmit={handleSubmit}
					direction='column'>
					<FormField
						fieldError={{
							text: errors.organization_name || '',
							isShow: !!errors.organization_name,
						}}>
						<FormInput
							name='organization_name'
							placeholder='Название организации'
							value={values.organization_name}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.contact_name || '',
							isShow: !!errors.contact_name,
						}}>
						<FormInput
							name='contact_name'
							placeholder='ФИО контактного лица'
							value={values.contact_name}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.contact_position || '',
							isShow: !!errors.contact_position,
						}}>
						<FormInput
							name='contact_position'
							placeholder='Должность (необязательно)'
							value={values.contact_position}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.phone || '',
							isShow: !!errors.phone,
						}}>
						<FormInput
							name='phone'
							placeholder='Телефон'
							value={values.phone}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.email || '',
							isShow: !!errors.email,
						}}>
						<FormInput
							name='email'
							placeholder='Электронная почта'
							value={values.email}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.topics || '',
							isShow: !!errors.topics,
						}}>
						<FormInput
							name='topics'
							placeholder='Интересующие направления / темы'
							value={values.topics}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.employees_count || '',
							isShow: !!errors.employees_count,
						}}>
						<FormInput
							name='employees_count'
							placeholder='Количество сотрудников'
							value={values.employees_count}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.desired_dates || '',
							isShow: !!errors.desired_dates,
						}}>
						<FormInput
							name='desired_dates'
							placeholder='Желаемые сроки (необязательно)'
							value={values.desired_dates}
							onChange={handleChange}
						/>
					</FormField>
					<FormField
						fieldError={{
							text: errors.comment || '',
							isShow: !!errors.comment,
						}}>
						<FormInput
							name='comment'
							placeholder='Дополнительные комментарии (необязательно)'
							value={values.comment}
							onChange={handleChange}
						/>
					</FormField>
					<Button
						text='Запросить коммерческое предложение'
						type='submit'
						color='blue'
						isBlock={isBlockSubmit}
						width='full'
					/>
				</Form>
				<Checkbox
					checked={values.agreement}
					onChange={() => handleCheckboxToggle('agreement')}
					label='Я даю согласие на обработку персональных данных и соглашаюсь с политикой конфиденциальности'
				/>
			</div>
			<span className={styles.caption}>
				Мы не передаём данные третьим лицам и используем их только для связи по
				вопросам корпоративного обучения.
			</span>
		</div>
	);
};
