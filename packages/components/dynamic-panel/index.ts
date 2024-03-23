import { withInstall } from "@viaz/utils";

import DynamicPanel from "./src/index.vue";

// import DynamicPanel from "./src/index-v1.vue";

// import DynamicPanel from "./src/index-v2.vue";

const VzDynamicPanel = withInstall(DynamicPanel);

export { VzDynamicPanel };

export default VzDynamicPanel;
