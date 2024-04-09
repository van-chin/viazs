<template>
  <div :class="prefixCls">
    <!-- labelShow -->

    <a-form ref="formRef" v-bind="data.items[0].item" v-if="formInstance">
      <template v-for="(item, index) in data.items[0].children">
        <template v-if="item.type === 'grid-layout'">
          <a-row :gutter="6">
            <a-col :key="index" v-for="(rowItem, index) in item.children" :span="rowItem.component.props.span
              ? rowItem.component.props.span
              : 24 / item.children.length
              ">
              <template v-for="ric in rowItem.children">
                <a-form-item v-if="ric.item.displayState === true" v-bind="ric.type === 'ims-form-divider'
                  ? Object.assign(
                    ric.item,
                    formInstance.validateInfos[ric.item.name],
                    { label: '' }
                  )
                  : Object.assign(
                    ric.item,
                    formInstance.validateInfos[ric.item.name]
                  )
                  " :label="data.items[0].item.labelShow ? ric.item.label : ''">
                  <component :class="ric.component.class" :is="ric.component.name || 'AInput'"
                    v-bind="ric.component.props" v-on="ric.component?.emitsEvents || {}"
                    v-model:[ric.vModelField]="data.model[ric.item.name]"></component>
                </a-form-item>
              </template>
            </a-col>
          </a-row>
        </template>

        <template v-else>
          <a-form-item v-if="item.item.displayState === true" v-bind="item.type === 'ims-form-divider'
            ? Object.assign(
              item.item,
              formInstance.validateInfos[item.item.name],
              { label: '' }
            )
            : Object.assign(
              item.item,
              formInstance.validateInfos[item.item.name]
            )
            " :label="data.items[0].item.labelShow ? item.item.label : ''">

            <tetemplate v-if="item.component.name === 'VzFormTable'">
              <!-- {{ item }} -->
              <component :is="item.component.name || 'AInput'" :class="item.component.class"
                v-bind="item.component.props" v-on="item.component?.emitsEvents || {}"
                @field-events="(params: any) => onFieldEvents(item.item.name, params)"
                v-model:[item.vModelField]="data.model[item.item.name]"></component>
            </tetemplate>

            <tetemplate v-else>
              <component :is="item.component.name || 'AInput'" :class="item.component.class"
                v-bind="item.component.props" v-on="item.component?.emitsEvents || {}"
                v-model:[item.vModelField]="data.model[item.item.name]"></component>
            </tetemplate>


          </a-form-item>
        </template>
      </template>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import type {
  VzFormRendererProps,
  UseFormType,
  VzFormExpose,
} from "@viaz/types";
import { useStyle } from "@viaz/hooks";
import { Form } from "ant-design-vue";
import { getCurrentInstance } from "vue";

import { foreach } from "tree-lodash";

import { ref, watch, toRefs, reactive } from "vue";

const COMPONENT_NAME = "VzFormRenderer";
defineOptions({
  name: COMPONENT_NAME,
});
const { prefixCls } = useStyle("form-renderer");

const props = withDefaults(defineProps<VzFormRendererProps>(), {});
const useForm = Form.useForm;

const formInstance = ref<UseFormType>();

const formRef = ref();

const currentInstance = getCurrentInstance();

const emits = defineEmits<{
  validateChange: [
    name: string | number | string[] | number[],
    status: boolean,
    errors: string[] | null
  ];
}>();

const emitEventHandler = (field: string, event: string, params: any) => {
  const eo = `${field}-${event}`;
  console.info('form-renderer eo =>', eo);
  currentInstance.emitsOptions[eo] = null;
  emits(eo, params);
};

const onFieldEvents = (field: string, params: any) => {
  console.info('onFieldEvents field=>', field);
  console.info('onFieldEvents params=>', params);
  // columnField: field, event, params: params

  const {columnField,event} = params;

  const eo = `${field}-${columnField}-${event}`;

  console.info('onFieldEvents .eo =>', eo);

  emits(eo, params.params);
}

const { data } = toRefs(props);

// 处理表单事件 emitsEvents

foreach(props.data.items[0].children, (item) => {
  if (item.component && item.component.events) {
    // console.info(item.item.label, item.item, item.component.props.events);
    let emitsEvents = {};
    for (const key in item.component.events) {
      emitsEvents[key] = (...args: any) => {
        let params = reactive({});
        item.component.events[key].map((pkey: string, index: number) => {
          params[pkey] = args[index];
        });
        emitEventHandler(item.item.name, key, params);
      };
    }
    item.component.emitsEvents = emitsEvents;
  }
});

const reset = () => {
  formInstance.value?.clearValidate();
  formInstance.value?.resetFields();
};

(async function init() {
  formInstance.value = useForm(props.data.model, props.data.rules, {
    onValidate: (name, status, errors) => {
      emits("validateChange", name, status, errors);
    },
  });
})();

defineExpose<VzFormExpose>({
  formInstance: formInstance.value,
  reset: reset,
} as VzFormExpose);

watch(data, (newVal) => {
  formInstance.value = useForm(newVal.model, newVal.rules, {
    onValidate: (name, status, errors) => {
      emits("validateChange", name, status, errors);
    },
  });
});
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-form-renderer";

.@{prefix-cls} {
  --at-apply: w-full;
}
</style>
