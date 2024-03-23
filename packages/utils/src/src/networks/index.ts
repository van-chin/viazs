// import { defHttp } from "./axios";

import type { NrlType, CreateAxiosOptions } from "@imsjs/ims-ui-types";
import { getEnvs } from "../env";
import { NRL_ALOVA, NRL_AXIOS } from "@imsjs/ims-ui-constants";
import { createAxios, defHttp } from "./axios";

export { createAxios, defHttp };

/**
 * @description 创建网络请求
 */
export function createNetWork<T>(options?: CreateAxiosOptions, nrl?: NrlType) {
  // if (nrl === undefined) {
  //   const { VITE_NRL } = getEnvs();
  //   nrl = VITE_NRL;
  // }

  return createAxios(options) as T;

  // if (nrl === NRL_AXIOS) {
  //   return createAxios(options) as T;
  // }

  // if (nrl === NRL_ALOVA) {
  //   return alova as T;
  // }
}
