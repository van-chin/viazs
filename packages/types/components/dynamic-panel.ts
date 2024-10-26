export interface VzDynamicPanelProps {
  /**
   * @description The default expand state of the panel
   * @default true
   */
  defaultExpand?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  /**
   * @description The minimum height of the panel
   */
  minHeight?: number;
  /**
   * @description The minimum width of the panel
   */
  minWidth?: number;
  /**
   * @description The mode of the panel, fixed or float
   * @default 'fixed'
   */
  mode?: "fixed" | "float";

  /**
   * @description The mode of the panel, fixed or float
   * @default 'fixed'
   */
  placement?: "left" | "right" | "top" | "bottom";
  /**
   * Whether the panel can be pinned or not
   *
   * @description Whether the panel can be pinned or not
   * @default true
   */
  pin?: boolean;

  resizeBorderColor?: string;

  /**
   * 边栏默认宽度
   * @description 边栏默认宽度 placement 为 'left' | 'right' 地生效
   */
  width?: number | string;
  /**
   * 边栏默认高度
   * @description 边栏默认高度, placement 为 'top' | 'bottom' 地生效
   */
  height?: number | string;
}

export const DEFAULT_HEIGHT = 180;
export const DEFAULT_WIDTH = 280;

export type placementType = "right" | "left" | "top" | "bottom";
