import { DataApi, DataParams } from "../shims/networks";

export interface VzListCheckboxGroupProps {
  height?: number;
  itemWidth?: number;
  itemNumber?: number;
  options?: any[];
  /** options 接口函数 */
  api?: Function | DataApi;
  /** 接口参数 */
  params?: DataParams[];
}
