import type { SelectProps as ASelectProps } from "ant-design-vue/es/select";

import { DataApi, DataParams } from "../shims/networks";

export interface VzTagSelectProps {
  /** options 接口函数 */
  api?: Function | DataApi;
  /** 接口参数 */
  params?: {
    [key: string]: any;
  };
  options?: ASelectProps["options"];
}
