<template>
  <a-cascader
    :class="prefixCls"
    v-bind="$attrs"
    :options="dataOptions"
    :loading="loading"
  ></a-cascader>
</template>
<script lang="ts" setup>
import { useRequest } from "vue-hooks-plus";
import { createNetWork } from "@viaz/utils";
import { useStyle } from "@viaz/hooks";

import { VzCascaderProps, DataApi } from "@viaz/types";
import type { CascaderProps } from "ant-design-vue/es/cascader";
import { ref, watch, toRefs } from "vue";

const { prefixCls } = useStyle("cascader");

import { isFunction, isObject } from "@vue/shared";

const COMPONENT_NAME = "VzCascader";
defineOptions({
  name: COMPONENT_NAME,
});

const dataOptions = ref<CascaderProps["options"]>([]);

const props = defineProps<VzCascaderProps>();

const { api, options = [], params } = toRefs(props);
// test
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
    dataOptions.value = options as CascaderProps["options"];
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
    dataOptions.value = data.value as CascaderProps["options"];
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
@prefix-cls: ~"@{namespace}-cascader";

.@{prefix-cls} {
  --at-apply: min-w-[200px] w-full;
}
</style>
