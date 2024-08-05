import type { CascaderProps as ACascaderProps } from "ant-design-vue/es/cascader";

import { DataApi, DataParams } from "../shims/networks";

export interface VzCascaderProps {
  /** options 接口函数 */
  api?: Function | DataApi;
  /** 接口参数 */
  params?: DataParams[];
  options?: ACascaderProps["options"];
}
