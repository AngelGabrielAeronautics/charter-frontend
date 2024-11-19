import { GetThunkAPI } from "@reduxjs/toolkit";
import axios from "axios";

import { IAgency as IRecord } from "@/lib/models";

import { eModules } from "../enums/modules.enums";
import { setAuthenticatedUser } from "../state/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { RootState } from "../state/store";
import { updateUser } from "../state/users/users.slice";
import BaseService from "./base.service";

export default class AgencyService extends BaseService {
  constructor(subject: eModules) {
    super(subject);
  }

  create = async (payload: IRecord, thunk: GetThunkAPI<any>) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}`,
      payload,
      {
        headers: this.headers,
      }
    );

    const data = await response.data;

    if (response.status != 201) throw new Error(data.message);

    const dispatch = thunk.dispatch;
    const state: any = thunk.getState();
    const { authenticatedUser } = state.auth;

    data &&
      dispatch(
        updateUser({ id: data.userId, payload: { agencyId: data._id } })
      );
    authenticatedUser &&
      dispatch(
        setAuthenticatedUser({ ...authenticatedUser, agencyId: data._id })
      );

    return data;
  };

  upload = async (payload: IRecord, key: string, id: string) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}/${key}/${id}`,
      payload,
      {
        headers: this.headers,
      }
    );

    const data = await response.data;

    if (response.status != 201) throw new Error(data.message);

    return data;
  };

  findAll = async () => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findOne = async (id: string) => {
    const response = await axios.get(`${this.baseUrl}/${this.subject}/${id}`, {
      headers: this.headers,
    });

    return response.data;
  };

  findByFilter = async (payload: any) => {
    const response = await axios.post(
      `${this.baseUrl}/${this.subject}/filter`,
      payload,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  update = async (id: string, payload: IRecord) => {
    const response = await axios.patch(
      `${this.baseUrl}/${this.subject}/${id}`,
      payload,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };

  remove = async (id: string) => {
    const response = await axios.delete(
      `${this.baseUrl}/${this.subject}/${id}`,
      {
        headers: this.headers,
      }
    );

    return response.data;
  };
}
