import axios from "axios";

import { AppAccessMenu, AppAccessModul } from "../interface/main_interface";

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
