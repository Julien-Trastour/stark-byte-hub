import { Navigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { authAtom } from "../store/authAtom";

type Props = {
	children: React.ReactNode;
	requiredRole?: "admin";
	requiredPermission?: string;
};

export default function ProtectedRoute({
	children,
	requiredRole,
	requiredPermission,
}: Props) {
	const user = useAtomValue(authAtom);
	const isAuthenticated = !!user;

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	const roleName = user.role?.name;
	const userPermissions = user.role?.permissions ?? [];

	// Protection par rôle
	if (
		requiredRole === "admin" &&
		roleName !== "admin" &&
		roleName !== "superadmin"
	) {
		return <Navigate to="/" replace />;
	}

	// Protection par permission
	if (requiredPermission && !userPermissions.includes(requiredPermission)) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
}
