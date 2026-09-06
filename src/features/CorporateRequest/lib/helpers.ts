import type { ICorporateRequestForm } from '../types/types';

import {
	required,
	phoneFormat,
	emailFormat,
} from '../../../shared/lib/validationRules';

export const validationSchema = {
	organization_name: [required('Введите название организации')],
	contact_name: [required('Введите ФИО контактного лица')],
	phone: [
		required('Введите номер телефона'),
		phoneFormat('Неверный формат номера телефона'),
	],
	email: [
		required('Введите электронную почту'),
		emailFormat('Неверный формат электронной почты'),
	],
	topics: [required('Укажите интересующие направления или темы')],
	employees_count: [required('Укажите количество сотрудников')],
};

export const initialFormValues: ICorporateRequestForm = {
	organization_name: '',
	contact_name: '',
	contact_position: '',
	phone: '',
	email: '',
	topics: '',
	employees_count: '',
	desired_dates: '',
	comment: '',
	agreement: false,
};

export const shouldBlockSubmit = (
	values: ICorporateRequestForm,
	errors: Record<string, string | undefined>
): boolean => {
	const employeesCount = Number(values.employees_count);
	return (
		!values.organization_name.trim() ||
		!!errors.organization_name ||
		!values.contact_name.trim() ||
		!!errors.contact_name ||
		!values.phone.trim() ||
		!!errors.phone ||
		!values.email.trim() ||
		!!errors.email ||
		!values.topics.trim() ||
		!!errors.topics ||
		!values.employees_count.trim() ||
		!!errors.employees_count ||
		!Number.isFinite(employeesCount) ||
		employeesCount < 1 ||
		!values.agreement
	);
};
