import type { FC, FormEvent } from 'react';
import type { IAdvisorMessage } from '../../../features/Advisor/types/types';

import { useEffect, useRef, useState } from 'react';

import {
	loadChatHistory,
	saveChatHistory,
	sendAdvisorChat,
} from '../../../features/Advisor/lib/helpers';
import { getErrorMessage } from '../../../shared/lib/getErrorMessage';
import { mapAdvisorToCards, ResultCards } from './result-cards';

import styles from '../styles/chat.module.scss';

const SUGGESTIONS = [
	'Хочу освоить Python с нуля, онлайн',
	'Очно за месяц до 30 тысяч',
	'Нужна переподготовка по DevOps',
	'Подскажите курс по бизнес-анализу',
];

interface IMatchChatProps {
	onOpenDetail: (programId: number, name: string) => void;
	onApply: (programId: number, name: string) => void;
}

export const MatchChat: FC<IMatchChatProps> = ({ onOpenDetail, onApply }) => {
	const [messages, setMessages] = useState<IAdvisorMessage[]>(() =>
		loadChatHistory()
	);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		saveChatHistory(messages);
	}, [messages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isLoading]);

	const sendMessage = async (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isLoading) return;

		const userMessage: IAdvisorMessage = { role: 'user', content: trimmed };
		const nextMessages = [...messages, userMessage];
		setMessages(nextMessages);
		setInput('');
		setError(null);
		setIsLoading(true);

		try {
			const history = nextMessages
				.slice(0, -1)
				.map((m) => ({ role: m.role, content: m.content }));
			const response = await sendAdvisorChat({
				message: trimmed,
				history,
			});
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content: response.reply,
					programs: response.programs || [],
				},
			]);
		} catch (err) {
			const message = getErrorMessage(err);
			setError(message);
			setMessages((prev) => [
				...prev,
				{
					role: 'assistant',
					content:
						message ||
						'Не удалось получить ответ. Попробуйте квиз «Подбор» или повторите позже.',
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		void sendMessage(input);
	};

	const handleClear = () => {
		setMessages([]);
		setError(null);
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.toolbar}>
				<p className={styles.hint}>
					Опишите цель, формат и бюджет — консультант подберёт программы из
					каталога.
				</p>
				{messages.length > 0 && (
					<button type='button' className={styles.clear} onClick={handleClear}>
						Очистить чат
					</button>
				)}
			</div>

			{messages.length === 0 && (
				<ul className={styles.suggestions}>
					{SUGGESTIONS.map((text) => (
						<li key={text}>
							<button
								type='button'
								className={styles.suggestion}
								onClick={() => void sendMessage(text)}>
								{text}
							</button>
						</li>
					))}
				</ul>
			)}

			<div className={styles.messages}>
				{messages.map((message, index) => (
					<div
						key={`${message.role}-${index}`}
						className={`${styles.message} ${
							styles[`message_${message.role}`]
						}`}>
						<p className={styles.message__text}>{message.content}</p>
						{message.programs && message.programs.length > 0 && (
							<ResultCards
								items={mapAdvisorToCards(message.programs)}
								onOpenDetail={onOpenDetail}
								onApply={onApply}
							/>
						)}
					</div>
				))}
				{isLoading && (
					<div className={`${styles.message} ${styles.message_assistant}`}>
						<p className={styles.message__text}>Подбираю варианты…</p>
					</div>
				)}
				<div ref={bottomRef} />
			</div>

			{error && <p className={styles.error}>{error}</p>}

			<form className={styles.form} onSubmit={handleSubmit}>
				<input
					className={styles.input}
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Например: нужен онлайн-курс по Python'
					disabled={isLoading}
				/>
				<button
					type='submit'
					className={styles.send}
					disabled={!input.trim() || isLoading}>
					Отправить
				</button>
			</form>
		</div>
	);
};
