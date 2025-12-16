import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function RequireMember({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  if (user?.publicMetadata?.role !== "member") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
