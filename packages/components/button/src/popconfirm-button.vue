<template>
  <a-popconfirm
    v-bind="$attrs"
    :title="canConfirm === true ? props.tipTitle : props.confirmTitle"
    :okButtonProps="{
      disabled: canConfirm,
    }"
  >
    <vz-button
      v-bind="$attrs"
      :class="prefixCls"
      @click="buttonClick"
    ></vz-button>
    <template #icon>
      <icon
        :icon="canConfirm === true ? props.tipIcon : props.confirmIcon"
        :color="canConfirm === true ? props.tipColor : props.confirmColor"
        :inline="true"
      ></icon>
    </template>
  </a-popconfirm>
</template>

<script lang="ts" setup>
import { useStyle } from "@viaz/hooks";
import VzButton from "./index.vue";
import { Icon } from "@iconify/vue";

import type { VzPopconfirmButtonButtonProps } from "@viaz/types";

const COMPONENT_NAME = "VzPopconfirmButton";

defineOptions({
  name: COMPONENT_NAME,
});

const props = withDefaults(defineProps<VzPopconfirmButtonButtonProps>(), {
  gapless: () => false,
  tipTitle: () => "校验未通过，请调整后继续!",
  confirmTitle: () => "确定按您所填数据进行提交么?",
  tipIcon: () => "ant-design:exclamation-circle-filled",
  confirmIcon: () => "ant-design:question-circle-filled",
  tipColor: () => "#faad14",
  confirmColor: () => "#faad14",
});

//

const emit = defineEmits(["click"]);

const canConfirm = defineModel<boolean>("canConfirm", { default: false });

const { prefixCls } = useStyle("popconfirm-button");

const buttonClick = () => {
  emit("click");
};
</script>

<!-- <style lang="less" scoped>
@prefix-cls: ~"@{namespace}-popconfirm-button";
.@{prefix-cls} {
}
</style> -->
