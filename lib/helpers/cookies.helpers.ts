import Cookies from "js-cookie";

import { IUser } from "@/lib/models/IUser";

export const getHeaders = () => {
  const ADI = Cookies.get("ADI");
  const ADN = Cookies.get("ADN");

  const headers = {
    ADI: ADI,
    ADN: ADN,
  };

  return headers;
};

export const setUserData = (user: IUser) => {
  user._id && Cookies.set("ADI", btoa(user._id));
  user.displayName && Cookies.set("ADN", btoa(user.displayName));
};

export const removeUserData = () => {
  Cookies.remove("ADI");
  Cookies.remove("ADN");
};
