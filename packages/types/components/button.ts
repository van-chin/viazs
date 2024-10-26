export interface VzButtonProps {
  /** 图标 */
  icon?: string;
  /** 文本 */
  text?: string;
  gapless?: boolean;
}

export interface VzPopconfirmButtonButtonProps {
  canConfirm: boolean;
  tipTitle?: string;
  confirmTitle?: string;
  tipIcon?: string;
  confirmIcon?: string;
  tipColor?: string;
  confirmColor?: string;
}
