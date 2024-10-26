import { withInstall } from "@viaz/utils";

import MonacoEditor from "./src/index.vue";

const VzMonacoEditor = withInstall(MonacoEditor);

export { VzMonacoEditor };

export default VzMonacoEditor;
