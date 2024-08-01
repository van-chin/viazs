<template>
  <a-select
    :class="prefixCls"
    v-bind="$attrs"
    :options="dataOptions"
    :loading="loading"
  ></a-select>
</template>
<script lang="ts" setup>
import { useRequest } from "vue-hooks-plus";
import { useStyle } from "@viaz/hooks";
import { createNetWork } from "@viaz/utils";
import { VzSelectProps, DataApi } from "@viaz/types";
import type { SelectProps } from "ant-design-vue";

import { ref, toRefs, watch } from "vue";

const { prefixCls } = useStyle("select");

import { isFunction, isObject } from "@vue/shared";

const COMPONENT_NAME = "VzSelect";
defineOptions({
  name: COMPONENT_NAME,
});

const dataOptions = ref<SelectProps["options"]>([]);

const props = defineProps<VzSelectProps>();

const { api, options = [], params } = toRefs(props);

const { data, loading, run } = useRequest(
  () => {
    if (isFunction(api)) {
      return api(params.value);
    }
    if (isObject(api)) {
      const network = createNetWork({}) as any;

      let tmpParams = parseParams();

      return network.get({
        url: generateUrl(api.value as DataApi),
        params: tmpParams,
      });
    }
  },
  {
    manual: true,
  }
);

const generateUrl = (apiData: DataApi) => {
  let url = "";
  if (apiData.protocol !== undefined) {
    url = `${apiData.protocol}${apiData.hpp}`;
  } else {
    url = apiData.hpp as string;
  }

  return url;
};

const parseParams = () => {
  let parsedParams: Record<string, string | number | boolean> = {};
  params.value?.forEach((item) => {
    if (item.status === true) {
      parsedParams[item.key] = item.value;
    }
  });

  return parsedParams;
};

const getOptions = async () => {
  if (api !== undefined) {
    run();
  } else {
    dataOptions.value = options as SelectProps["options"];
  }
};

(async () => {
  getOptions();
})();

watch(
  () => params,
  () => {
    getOptions();
    // run();
  },
  {
    deep: true,
  }
);

watch(
  () => data,
  () => {
    dataOptions.value = data.value as SelectProps["options"];
    // run();
  },
  {
    deep: true,
  }
);

watch(
  () => options,
  () => {
    getOptions();
  },
  {
    deep: true,
  }
);
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-select";

.@{prefix-cls} {
  --at-apply: min-w-100px w-full;
}
</style>
