import axios from "axios";

import {
  AppAccessMenu,
  AppAccessModul,
  AppGroupUser,
  AppModul,
  Users,
} from "../interface/main_interface";
import { convertObjectIntoQueryParams } from "./function";

export const headerMenuFetcher = async (url: string) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: AppAccessModul[]; success: boolean } =
    request.data;

  return data;
};

export const accessibleMenuFetcher = async ([url, route]: any) => {
  const request = await axios.get(`${url}`, { params: { route } });
  const { data, success }: { data: AppAccessMenu[]; success: boolean } =
    request.data;

  return data;
};

export const userGroupFetcher = async ([url, params]: any) => {
  const queryParam = convertObjectIntoQueryParams(params);
  const request = await axios.get(`${url}${queryParam}`);
  const { data, success }: { data: AppGroupUser[]; success: boolean } =
    request.data;
  return data;
};

export const userFetcher = async ([url, params]: any) => {
  const queryParam = convertObjectIntoQueryParams(params);
  const request = await axios.get(`${url}${queryParam}`);
  const { data, success }: { data: Users[]; success: boolean } = request.data;
  return data;
};

export const modulFetcher = async ([url, params]:any) => {
  const queryParam = convertObjectIntoQueryParams(params);
  const request = await axios.get(`${url}${queryParam}`);
  const { data, success }: { data: AppModul[]; success: boolean } =
    request.data;
  return data;
};