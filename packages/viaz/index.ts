import "iconify-icon";
import installer from "./defaults";

export * from "@viaz/types";

export * from "@viaz/utils";

export * from "@viaz/hooks";

export { useMessage, useStyle, useRefs } from "@viaz/hooks";

export { withInstall } from "@viaz/utils";

export * from "@viaz/components";

export * from "./make-installer";

export const install = installer.install;

export const version = installer.version;

export default installer;
