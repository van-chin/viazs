<template>

  <a-checkbox-group :class="prefixCls" v-bind="$attrs" :options="innerOptions" @change="onChange">
    <template #label="itemData">
      {{ itemData[fieldNames.label] }}
    </template>
  </a-checkbox-group>

</template>

<script lang="ts" setup>


import { useRequest } from "vue-hooks-plus";
import { useStyle } from "@viaz/hooks";
import { toRefs, ref, watch } from "vue";

import { createNetWork } from "@viaz/utils";
import type { VzCheckboxGroupProps, DataApi } from "@viaz/types";

import { isFunction, isObject } from "@vue/shared";

const { prefixCls } = useStyle("checkbox-group");

const COMPONENT_NAME = "VzCheckboxGroup";

defineOptions({
  name: COMPONENT_NAME,
});

const innerOptions = ref<VzCheckboxGroupProps['options']>([]);

type CheckboxGroupValue = string[] | number[];

const props = withDefaults(defineProps<VzCheckboxGroupProps>(), {
  fieldNames:{ "label": "name", "value": "id" }
});



const { api, options, params, min, max,fieldNames } = toRefs(props);



const { data, run } = useRequest(
  () => {
    if (isFunction(api)) {
      return api(params.value);
    }
    if (isObject(api)) {
      const network = createNetWork({}) as any;

      let tmpParams = parseParams();

      let res = network.get({
        url: generateUrl(api.value as DataApi),
        params: tmpParams,
      });

      console.info('res =>',res);

      return res;
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
    innerOptions.value = options.value as VzCheckboxGroupProps["options"];
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
    console.info('data.value =>',data.value);
    innerOptions.value = data.value as VzCheckboxGroupProps["options"];
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

const onChange = (checkedValue: CheckboxGroupValue) => {

  if (max.value) {
    if (checkedValue.length === max.value) {
      innerOptions.value.forEach((option) => {
        option.disabled = !checkedValue.includes(option.value as never);
      });
    }

    if (checkedValue.length < max.value) {
      innerOptions.value.forEach((option) => {
        option.disabled = false;
      });
    }
  }

}



</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-checkbox-group";

.@{prefix-cls} {
  // --at-apply: w-full h-full;
  // border: 1px solid red;

}
</style>
