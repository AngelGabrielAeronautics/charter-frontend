import { useRouter } from "next/router";
import { useEffect } from "react";

import { eRoutes } from "@/app/(config)/routes";

import { useAppSelector } from "@/lib/state/hooks";

const useAuth = () => {
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated); // Adjust based on your Redux state

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(eRoutes.login); // Redirect to login page if not authenticated
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

export default useAuth;
