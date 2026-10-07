import type { FC } from 'react';

import { Main } from '../components/Main/main';
import { Format } from '../components/Format/format';
import { Course } from '../components/Course/course';
import { Footer } from '../components/Footer/footer';

import styles from '../styles/course-page.module.scss';

export const CoursePage: FC = () => {
	return (
		<div className={styles.course}>
			<Main />
			<Course />
			<Format />
			<Footer />
		</div>
	);
};
