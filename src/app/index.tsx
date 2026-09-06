import { Route, Routes } from 'react-router-dom';

import { useEffect, useState } from 'react';

import { Landing } from '../pages/Landing/ui/landing';
import { CoursePage } from '../pages/CoursePage/ui/course-page';
import { CourseDetail } from '../pages/CourseDetail/ui/course-detail';
import { ComparePage } from '../pages/Compare/ui/compare';
import { MatchPage } from '../pages/Match/ui/match';
import { NotFound } from '../pages/NotFound/ui/not-found';

import { ToastProvider } from '../shared/components/ToastProvider/ui/ToastProvider';
import { CompareBar } from '../features/Compare/ui/compare-bar';
import { EROUTES } from '../shared/utils/routes';

import styles from './app.module.scss';

export const App = () => {
	const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);
	return (
		<ToastProvider>
			<div className={styles.page}>
				<Routes>
					<Route path={EROUTES.LANDING} element={<Landing />} />
					<Route path={EROUTES.COURSE} element={<CoursePage />} />
					<Route
						path={`${EROUTES.COURSE}/:courseId`}
						element={<CourseDetail windowWidth={windowWidth} />}
					/>
					<Route path={EROUTES.COMPARE} element={<ComparePage />} />
					<Route path={EROUTES.MATCH} element={<MatchPage />} />

					<Route path='*' element={<NotFound />} />
				</Routes>

				<CompareBar />
				<div id='modal-root'></div>
				<div id='toast-root'></div>
			</div>
		</ToastProvider>
	);
};
