import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

const LoadingFallback = () => (
  <div className="w-full flex items-center justify-center py-20">
    <span className="text-sm text-slate-500">Checking session...</span>
  </div>
);

export default function ProtectedRoute({ element }) {
  const { user, loading, fetchSession } = useAuthStore();
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (user) {
      setSessionChecked(true);
      return () => {
        cancelled = true;
      };
    }

    setSessionChecked(false);
    Promise.resolve(fetchSession())
      .catch(() => {
        // Swallow errors here; navigation logic below will redirect unauthenticated users.
      })
      .finally(() => {
        if (!cancelled) {
          setSessionChecked(true);
          useAuthStore.setState({ loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, fetchSession]);

  if (user) return element;

  if (loading || !sessionChecked) {
    return <LoadingFallback />;
  }

  if (!user) return <Navigate to="/login" replace />;

  return element;
}
