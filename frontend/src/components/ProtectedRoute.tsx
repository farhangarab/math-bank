import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../router/routes";
import type { UserRole } from "../types/auth";

type ProtectedRouteProps = {
  roles?: UserRole[];
};

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    const fallbackRoute =
      user.role === "TEACHER"
        ? ROUTES.TEACHER_DASHBOARD
        : ROUTES.STUDENT_DASHBOARD;

    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
}
