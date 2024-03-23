import type { SelectProps as ASelectProps } from "ant-design-vue";

import { DataApi, DataParams } from "../shims/networks";
export interface VzSelectProps {
  api?: Function | DataApi;
  /** 接口参数 */
  params?: DataParams[];

  options?: ASelectProps["options"];
}
