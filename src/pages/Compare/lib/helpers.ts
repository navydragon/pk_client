import type { IBatch, IProgram, IStream } from '../../../store/landing/types';

import { convertDateShort } from '../../../shared/lib/date';

export interface ICompareRow {
	key: string;
	label: string;
	values: string[];
	isDifferent: boolean;
}

const programTypeLabel = (type: IProgram['program_type']) =>
	type === 'pp' ? 'Профессиональная переподготовка' : 'Повышение квалификации';

const nearestBatchLabel = (
	programId: number,
	streams: IStream[]
): string => {
	const stream = streams.find((s) => s.id === programId);
	if (!stream || stream.batches.length === 0) {
		return 'Нет ближайших потоков';
	}
	const batch = stream.batches[0];
	const end = batch.end_date ? ` — ${convertDateShort(batch.end_date)}` : '';
	return `${convertDateShort(batch.start_date)}${end}`;
};

const buildRows = (
	labels: string[],
	columns: string[][]
): ICompareRow[] =>
	labels.map((label, index) => {
		const values = columns.map((col) => col[index] || '—');
		const isDifferent = values.some((v) => v !== values[0]);
		return {
			key: `row-${index}`,
			label,
			values,
			isDifferent,
		};
	});

export const buildProgramCompareRows = (
	programs: IProgram[],
	streams: IStream[]
): ICompareRow[] => {
	const labels = [
		'Направление',
		'Вид программы',
		'Формат',
		'Объём',
		'Длительность',
		'Стоимость',
		'Целевая аудитория',
		'Итог',
		'Требования',
		'Ближайший поток',
	];
	const columns = programs.map((p) => [
		p.direction_name || '—',
		programTypeLabel(p.program_type),
		p.learning_format || '—',
		p.hours_volume ? `${p.hours_volume} ак. час.` : '—',
		p.duration || '—',
		p.cost ? `${p.cost} ₽` : '—',
		p.target_audience || '—',
		p.outcome || '—',
		p.requirements || '—',
		nearestBatchLabel(p.id, streams),
	]);
	return buildRows(labels, columns);
};

export interface ICompareBatchItem {
	batch: IBatch;
	programId: number;
	programName: string;
	directionName: string;
}

export const collectBatches = (
	streams: IStream[],
	batchIds: number[]
): ICompareBatchItem[] => {
	const result: ICompareBatchItem[] = [];
	for (const stream of streams) {
		for (const batch of stream.batches) {
			if (batchIds.includes(batch.id)) {
				result.push({
					batch,
					programId: stream.id,
					programName: stream.name,
					directionName: stream.direction_name,
				});
			}
		}
	}
	return result.sort(
		(a, b) => batchIds.indexOf(a.batch.id) - batchIds.indexOf(b.batch.id)
	);
};

export const buildBatchCompareRows = (
	items: ICompareBatchItem[]
): ICompareRow[] => {
	const labels = [
		'Программа',
		'Направление',
		'Название потока',
		'Даты',
		'Формат',
		'Стоимость',
		'Расписание',
		'Мест',
		'Статус набора',
	];
	const columns = items.map(({ batch, programName, directionName }) => {
		const end = batch.end_date ? ` — ${convertDateShort(batch.end_date)}` : '';
		return [
			programName,
			directionName || '—',
			batch.name || '—',
			`${convertDateShort(batch.start_date)}${end}`,
			batch.learning_format || '—',
			batch.cost || '—',
			batch.schedule || '—',
			batch.seats_count != null ? String(batch.seats_count) : '—',
			batch.enrollment_status_text || '—',
		];
	});
	return buildRows(labels, columns);
};
