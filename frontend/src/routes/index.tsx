import {
	createRoutesFromElements,
	Route,
	createBrowserRouter,
} from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import HomePage from "../pages/common/HomePage";
import RobotsPage from "../pages/common/RobotsPage";
import RobotDetailsPage from "../pages/common/RobotDetailsPage";
import RobotControlPage from "../pages/common/RobotControlPage";

// Pages Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Pages Admin
import AdminNewsPage from "../pages/admin/AdminNewsPage";
import AdminRobotsPage from "../pages/admin/AdminRobotsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage"; // 👈 nouvelle page

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
				<Route path="robots/:id" element={<RobotDetailsPage />} />
				<Route path="robots/:id/control" element={<RobotControlPage />} />

				{/* ⚙️ Routes Admin (accessibles uniquement aux admin ou superadmin) */}
				<Route
					path="admin/news"
					element={
						<ProtectedRoute requiredRole="admin">
							<AdminNewsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="admin/robots"
					element={
						<ProtectedRoute requiredRole="admin">
							<AdminRobotsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="admin/users"
					element={
						<ProtectedRoute requiredRole="admin">
							<AdminUsersPage />
						</ProtectedRoute>
					}
				/>
			</Route>

			{/* 🌐 Pages publiques */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/reset-password" element={<ResetPassword />} />
		</>
	)
);

export default router;
