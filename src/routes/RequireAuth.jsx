import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const initialized = useAuthStore((s) => s.initialized);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  useEffect(() => {
    if (!user && !initialized) fetchSession();
  }, [user, initialized, fetchSession]);

  if (loading || !initialized) return null;
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
