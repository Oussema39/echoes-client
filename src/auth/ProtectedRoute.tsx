import Loader from "@/components/ui/loader";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  debugger;
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isLoading && isAuthenticated) {
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoute;
