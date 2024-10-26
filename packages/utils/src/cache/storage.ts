import { useStorage, type RemovableRef } from "@vueuse/core";
// import type { RemovableRef } from "@vue/shared";

// import type { BasicKeys } from "@viaz/types";

import { ACCESS_TOKEN_KEY } from "@viaz/constants";

export function getToken<T>(
  key: any = ACCESS_TOKEN_KEY
): RemovableRef<T> {
  return useStorage(key, undefined) as RemovableRef<T>;
}
