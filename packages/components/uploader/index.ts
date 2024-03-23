import { withInstall } from "@viaz/utils";
import Uploader from "./src/index.vue";

const VzUploader = withInstall(Uploader);

export { VzUploader };

export default VzUploader;
