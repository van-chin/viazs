import { withInstall } from "@viaz/utils";

import Button from "./src/index.vue";

import PopconfirmButton from "./src/popconfirm-button.vue";

export const VzButton = withInstall(Button);

export const VzPopconfirmButton = withInstall(PopconfirmButton);

export default VzButton;
