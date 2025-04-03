import { createBrowserRouter } from "react-router";
import type { RouteObject } from "react-router";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";

// Pages - Communes
import HomePage from "../pages/common/HomePage";
import RobotsPage from "../pages/common/RobotsPage";
import RobotDetailsPage from "../pages/common/RobotDetailsPage";
import RobotControlPage from "../pages/common/RobotControlPage";
import NotFoundPage from "../pages/common/NotFoundPage";

// Auth
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin
import AdminNewsPage from "../pages/admin/AdminNewsPage";
import AdminRobotsPage from "../pages/admin/AdminRobotsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminRolesPage from "../pages/admin/AdminRolesPage";
import AdminPermissionsPage from "../pages/admin/AdminPermissionsPage";

const routes: RouteObject[] = [
	{
		path: "/",
		element: (
			<ProtectedRoute>
				<DashboardLayout />
			</ProtectedRoute>
		),
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "robots", element: <RobotsPage /> },
			{ path: "robots/:id", element: <RobotDetailsPage /> },
			{ path: "robots/:id/control", element: <RobotControlPage /> },

			// Admin (protégés par permissions spécifiques)
			{
				path: "admin/news",
				element: (
					<ProtectedRoute requiredPermission="view_news">
						<AdminNewsPage />
					</ProtectedRoute>
				),
			},
			{
				path: "admin/robots",
				element: (
					<ProtectedRoute requiredPermission="view_all_robots">
						<AdminRobotsPage />
					</ProtectedRoute>
				),
			},
			{
				path: "admin/users",
				element: (
					<ProtectedRoute requiredPermission="view_users">
						<AdminUsersPage />
					</ProtectedRoute>
				),
			},
			{
				path: "admin/roles",
				element: (
					<ProtectedRoute requiredPermission="view_roles">
						<AdminRolesPage />
					</ProtectedRoute>
				),
			},
			{
				path: "admin/permissions",
				element: (
					<ProtectedRoute requiredPermission="view_permissions">
						<AdminPermissionsPage />
					</ProtectedRoute>
				),
			},

			{ path: "*", element: <NotFoundPage /> },
		],
	},

	// Public
	{ path: "/login", element: <Login /> },
	{ path: "/register", element: <Register /> },
	{ path: "/forgot-password", element: <ForgotPassword /> },
	{ path: "/reset-password", element: <ResetPassword /> },
];

const router = createBrowserRouter(routes);
export default router;
