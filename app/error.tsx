"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button, Flex, Result } from "antd";

import { useAppSelector } from "@/lib/state/hooks";

interface IProps {
  error: any;
  reset: () => void;
}

const error = ({ error, reset }: IProps) => {
  const { isAuthenticated, authenticatedUser } = useAppSelector(
    (state) => state.auth
  );
  const router = useRouter();

  const getRoute = () => {
    if (isAuthenticated && authenticatedUser && authenticatedUser.role) {
      if (authenticatedUser.role == "Client") {
        return "/";
      } else {
        return `/${authenticatedUser.role == "Administrator" ? "admin" : authenticatedUser.role}/dashboard`;
      }
    }

    return "/";
  };

  return (
    <Flex justify="center" align="center" className="h-full w-full">
      <Result
        status="warning"
        title="Oops! Looks like something went wrong."
        subTitle={error.message}
        extra={
          <>
            {isAuthenticated &&
              authenticatedUser &&
              authenticatedUser?.role && (
                <Button
                  type="primary"
                  key="console"
                  onClick={() => router.replace(getRoute())}
                >
                  Dashboard
                </Button>
              )}
            {!isAuthenticated && (
              <Button
                type="primary"
                key="console"
                onClick={() => router.replace("/login")}
              >
                Login
              </Button>
            )}
          </>
        }
      />
    </Flex>
  );
};

export default error;
