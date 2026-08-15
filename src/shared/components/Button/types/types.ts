import type { CSSProperties } from 'react';

export interface IButtonProps {
	text: string;
	type?: 'button' | 'submit' | 'link';
	form?: string;
	href?: string;
	style?: CSSProperties;
	color?:
		| 'default'
		| 'blue'
		| 'white'
		| 'black'
		| 'confirm'
		| 'cancel'
		| 'green'
		| 'red'
		| 'purple'
		| 'outline';
	withIcon?: {
		type:
			| 'add'
			| 'confirm'
			| 'next'
			| 'prev'
			| 'send'
			| 'check'
			| 'back'
			| 'return'
			| 'cancel'
			| 'info';
		position?: 'left' | 'right';
		color?: 'black' | 'white' | 'blue' | 'grey';
	};
	width?: 'default' | 'full' | 'auto';
	isBlock?: boolean;
	onClick?: () => void;
}
