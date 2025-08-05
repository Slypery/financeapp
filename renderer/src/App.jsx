import { Routes, Route, Navigate } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import LoginLayout from './layouts/LoginLayout';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transaction from './pages/Transaction';
import Login from './pages/Login';
import CreateNewDB from './pages/CreateNewDB';
import { useEffect } from 'react';
import AnimatedLayout from './components/AnimatedLayout';
import useTheme from './hooks/useTheme';

function App() {
	const theme = useTheme((s) => s.theme);

	// set theme
	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);

	// auto close dropdown
	useEffect(() => {
		const closeDropWhenClickedOutside = (e) => {
				document.querySelectorAll('details.dropdown.open').forEach((detailsEl) => {
					if (detailsEl.contains(e.target)) return;
					detailsEl.querySelector('summary').click();
				});
		};

		const closeDropWhenClickedEsc = (e) => {
			if (e.key === 'Escape') {
				document.querySelectorAll('details.dropdown.open>summary').forEach((summaryEl) => {
					summaryEl.click();
				});
			}
		};

		document.addEventListener('click', closeDropWhenClickedOutside);
		document.addEventListener('keydown', closeDropWhenClickedEsc);

		return () => {
			document.removeEventListener('click', closeDropWhenClickedOutside);
			document.removeEventListener('keydown', closeDropWhenClickedEsc);
		};
	}, []);
	return (
		<>
			<Routes>
				<Route path="/" element={<AnimatedLayout />}>
					<Route index element={<Navigate to="/auth/login" replace />} />
					<Route path="pages" element={<DefaultLayout />}>
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="accounts" element={<Accounts />} />
						<Route path="transaction" element={<Transaction />} />
					</Route>
					<Route path="auth" element={<LoginLayout />}>
						<Route path="login" element={<Login />} />
						<Route path="create-new-db" element={<CreateNewDB />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;