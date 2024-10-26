import { withInstall } from "@viaz/utils";

import Form from "./src/index.vue";

import FormItem from "./src/form-item.vue";

export const VzForm = withInstall(Form);

export const VzFormItem = withInstall(FormItem);

export default VzForm;
