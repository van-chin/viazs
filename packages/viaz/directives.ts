// import type { Directive } from "vue";

// interface DirectiveCollections {
//   [key: string]: Directive;
// }

import { resize } from "@viaz/directives";

// console.info("resize =>", resize);

const directiveCollections: DirectiveCollections = {
  resize,
};

export default directiveCollections;
