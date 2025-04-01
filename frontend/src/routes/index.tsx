import {
	createRoutesFromElements,
	Route,
	createBrowserRouter,
} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import HomePage from "../pages/common/HomePage";
import RobotsPage from "../pages/common/RobotsPage";

// Pages Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* 🔐 Zone protégée (dashboard) */}
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<DashboardLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<HomePage />} />
				<Route path="robots" element={<RobotsPage />} />
			</Route>

			{/* 🌐 Pages publiques */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
		</>
	),
);

export default router;
