import { useEffect, useState } from "react";

import { useAppSelector } from "@/lib/state/hooks";

const useRole = (requiredRole: string) => {
  const { isAuthenticated, authenticatedUser } = useAppSelector(
    (state) => state.auth
  );
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      authenticatedUser?.rolePermissions.includes(requiredRole)
    ) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, authenticatedUser, requiredRole]);

  // Function that renders content or Unauthorized component
  const renderUnauthorized = (UnauthorizedComponent: JSX.Element) => {
    if (!isAuthorized) {
      return UnauthorizedComponent; // Render unauthorized content
    }
    return null; // Return null when authorized
  };

  return { isAuthorized, renderUnauthorized };
};

export default useRole;
