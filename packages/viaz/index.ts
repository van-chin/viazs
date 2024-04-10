export * from "@viaz/types";

export * from "@viaz/utils";

export * from "@viaz/hooks";

export { useMessage } from "@viaz/hooks";

export * from "@viaz/components";

export * from "./make-installer";

import installer from "./defaults";

export const install = installer.install;

export const version = installer.version;

export default installer;
