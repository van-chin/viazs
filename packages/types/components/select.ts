
import type { SelectProps as ASelectProps } from "ant-design-vue/es/select"; // 这样引入 还是 慢

import { DataApi, DataParams } from "../shims/networks";

export interface VzSelectProps {
  api?: Function | DataApi;
  /** 接口参数 */
  params?: DataParams[];
  // 这里用了 antdv 组件的类型 HMR 就会慢
  options?: ASelectProps["options"];
  // options?: any[];
}
