import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "@/api/userApi";

export default function ProtectedRoute({ element }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    getUser()
      .then((res) => {
        if (res?.success) setAllowed(true);
        setLoading(false);
      })
      .catch(() => {
        setAllowed(false);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  return allowed ? element : <Navigate to="/login" replace />;
}
