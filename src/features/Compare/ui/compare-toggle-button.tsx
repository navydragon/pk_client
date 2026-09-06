import type { CSSProperties, FC } from 'react';

import { useDispatch, useSelector } from '../../../store/store';
import { useToast } from '../../../shared/components/ToastProvider/ui/ToastProvider';

import { Button } from '../../../shared/components/Button/ui/button';
import { COMPARE_LIMIT } from '../../../store/compare/types';
import { toggleBatch, toggleProgram } from '../../../store/compare/reducer';

interface ICompareToggleButtonProps {
	type: 'program' | 'batch';
	id: number;
	style?: CSSProperties;
}

export const CompareToggleButton: FC<ICompareToggleButtonProps> = ({
	type,
	id,
	style,
}) => {
	const dispatch = useDispatch();
	const { showToast } = useToast();
	const { programIds, batchIds } = useSelector((state) => state.compare);

	const isSelected =
		type === 'program' ? programIds.includes(id) : batchIds.includes(id);
	const list = type === 'program' ? programIds : batchIds;
	const isFull = !isSelected && list.length >= COMPARE_LIMIT;

	const handleClick = () => {
		if (isFull) {
			showToast({
				type: 'warning',
				title: 'Лимит сравнения',
				text: 'Можно сравнить не больше трёх вариантов',
			});
			return;
		}
		if (type === 'program') {
			dispatch(toggleProgram(id));
		} else {
			dispatch(toggleBatch(id));
		}
	};

	return (
		<Button
			text={isSelected ? 'В сравнении' : 'Сравнить'}
			color={isSelected ? 'outline' : 'white'}
			style={style}
			onClick={handleClick}
		/>
	);
};
