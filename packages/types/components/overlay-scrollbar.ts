import type { OverlayScrollbarsComponentProps } from "overlayscrollbars-vue";

export interface VzOverlayScrollbarProps {
  options?:
    | DeepPartial<OverlayScrollbarsComponentProps["options"]>
    | false
    | null;
}
