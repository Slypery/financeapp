import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import TwClassPreload from './components/TwClassPreload';
import DefaultLayout from './layouts/DefaultLayout';
import LoginLayout from './layouts/LoginLayout';
import Dashboard from './pages/Dashboard';
import SourceOfFund from './pages/SourceOfFund';
import Transaction from './pages/Transaction';
import Goals from './pages/Goals';
import Login from './pages/Login';
import CreateNewDB from './pages/CreateNewDB';
import { useEffect } from 'react';
import useMeta from './hooks/useMeta';
import AnimatedLayout from './components/AnimatedLayout';

function App() {
	const theme = useMeta((state) => state.meta.app_theme);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	}, [theme]);
	return (
		<>
			<Routes>
				<Route path="/" element={<AnimatedLayout />}>
					<Route index element={<Navigate to="/auth/login" replace />} />
					<Route path="pages" element={<DefaultLayout />}>
						<Route path="dashboard" element={<Dashboard />} />
						<Route path="source-of-fund" element={<SourceOfFund />} />
						<Route path="transaction" element={<Transaction />} />
						<Route path="goals" element={<Goals />} />
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