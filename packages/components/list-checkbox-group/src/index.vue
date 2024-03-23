<template>
  <div :class="prefixCls" :style="`height: ${height}px;`">
    <vz-overlay-scrollbar>
      <a-checkbox-group v-model:value="modelValue">
        <div class="w-full mb-2 p-2" v-for="item in dataOptions" :key="item.id">
          <div class="title mb-2 font-bold">{{ item.name }}</div>
          <div
            class="service-items"
            :style="`grid-template-columns: repeat(${itemNumber}, 1fr);`"
          >
            <div class="" v-for="si in item.serviceItems">
              <a-checkbox :value="si.id">
                <div :style="`width: ${itemWidth}px;`" class="ellipsis">
                  <a-tooltip placement="topLeft">
                    <template #title>{{ si.name }}</template>
                    {{ si.name }}
                  </a-tooltip>
                </div>
              </a-checkbox>
            </div>
          </div>
        </div>
      </a-checkbox-group>
    </vz-overlay-scrollbar>
  </div>
</template>
<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import type { VzListCheckboxGroupProps, DataApi } from "@viaz/types";
import { toRefs, watch, ref } from "vue";
import { isFunction, isObject } from "@vue/shared";
import { useRequest } from "vue-hooks-plus";
import { createNetWork } from "@viaz/utils";

const COMPONENT_NAME = "VzListCheckboxGroup";
defineOptions({
  name: COMPONENT_NAME,
});

const { prefixCls } = useStyle("list-checkbox-group");

const dataOptions = ref<any[]>([]);

const modelValue = defineModel("value");

const props = withDefaults(defineProps<VzListCheckboxGroupProps>(), {
  height: 200,
  itemWidth: 220,
  itemNumber: 3,
  options: [],
});

const { height, itemWidth, itemNumber, options, api, params } = toRefs(props);

const { data, run } = useRequest(
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
    if (item.status !== false) {
      parsedParams[item.key] = item.value;
    }
  });

  return parsedParams;
};

const getOptions = async () => {
  if (api !== undefined) {
    run();
  } else {
    dataOptions.value = options;
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
    dataOptions.value = data.value;
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
@prefix-cls: ~"@{namespace}-list-checkbox-group";

.@{prefix-cls} {
  border: 1px solid rgba(5, 5, 5, 0.06);
  --at-apply: w-full rd;
  // height: 400px;

  .ellipsis {
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 超出部分隐藏 */
    text-overflow: ellipsis; /* 溢出部分显示省略号 */
  }

  .service-items {
    display: grid;
    gap: 16px;
  }
}
</style>
