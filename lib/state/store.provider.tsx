"use client";

import { useRef } from "react";
import React from "react";

import { onAuthStateChanged } from "firebase/auth";
import { Provider } from "react-redux";

import { auth } from "../firebase/firebase";
import { getUserByFID } from "../firebase/users.service";
import { IUser } from "../models/IUser";
import { getCurrentAgency } from "./agency/slice";
import { setAuthenticatedUser } from "./auth/auth.slice";
import { getCurrentOperator } from "./operators/operators.slice";
import { AppStore, makeStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();

  const getAuthStateData = async (fid: string): Promise<IUser | false> => {
    const user = await getUserByFID(fid);

    if (!user) return false;

    return user;
  };

  let checked = false;

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    checked = true;

    // storeRef.current.dispatch(fetchSystemCommodities())

    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (checked) {
          getAuthStateData(user.uid)
            .then((data) => {
              if (storeRef.current && data) {
                storeRef.current.dispatch(setAuthenticatedUser(data));

                if (data.role == "Operator" && data.operatorId) {
                  storeRef.current.dispatch(
                    getCurrentOperator(data.operatorId)
                  );
                }

                if (data.role == "Agency" && data.agencyId) {
                  storeRef.current.dispatch(getCurrentAgency(data.agencyId));
                }
              }
            })
            .catch((e) => {});
        }
      }
    });
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
