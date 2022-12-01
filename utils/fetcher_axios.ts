import axios from "axios";

import { AppAccessModul } from "../interface/main_interface";

export const headerMenuFetcher = async (url: string, params?: any) => {
  const request = await axios.get(`${url}`);
  const { data, success }: { data: AppAccessModul[]; success: boolean } =
    request.data;

  return data;
};
