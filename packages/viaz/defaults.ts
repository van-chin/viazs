import { makeInstaller } from "./make-installer";
import Components from "./components";
import Plugins from "./plugin";

import Directives from "./directives";

export default makeInstaller([...Components, ...Plugins], Directives);
