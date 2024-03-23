// import { defHttp } from "./axios";

import type { CreateAxiosOptions } from "@viaz/types";

import { createAxios, defHttp } from "./axios";

export { createAxios, defHttp };

/**
 * @description 创建网络请求
 */
export function createNetWork<T>(options?: CreateAxiosOptions) {
  return createAxios(options) as T;
}
