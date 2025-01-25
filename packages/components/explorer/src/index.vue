<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-flex`">
      <VzDynamicPanel width="0px" placement="left" ref="dpElRef">
        <div class="h-full w-full inner-content-wrap">
          <div class="w-full">123</div>
        </div>
      </VzDynamicPanel>
      <div :class="`${prefixCls}-flex-contents`" ref="contentElRef">
        <div :class="`${prefixCls}-flex-contents-header`">
          <div>
            <a-space>
              <a-button type="primary" @click="onUpload">上传</a-button>
              <a-button :disabled="true">删除</a-button>
              <a-button :disabled="true">移动</a-button>
            </a-space>
          </div>
          <div>
            <a-space>
              <a-input-search
                v-model:value="filters.keywords"
                placeholder="按 名称 搜索"
                enter-button
                allowClear
                @search="onSearch"
              />
              <a-radio-group v-model:value="viewMode">
                <a-radio-button value="list">列表</a-radio-button>
                <a-radio-button value="tile">平铺</a-radio-button>
              </a-radio-group>
            </a-space>
          </div>
        </div>
        <div :class="`${prefixCls}-flex-contents-main`">
          <div class="p-2">
            <a-checkbox-group
              v-model:value="modelValue"
              @change="onCheckChange"
            >
              <a-space wrap>
                <div
                  :class="`${prefixCls}-flex-contents-main-file-item`"
                  v-for="item in lists"
                >
                  <div
                    :class="`${prefixCls}-flex-contents-main-file-item-cover`"
                  >
                    <a-image
                      :src="item.cover"
                      width="140px"
                      height="120px"
                      v-if="item.extension != 'mp4'"
                    />
                    <vz-hover-mask v-else>
                      <div class="w-full">
                        <img
                          :src="item.cover"
                          :class="`${prefixCls}-flex-contents-main-file-item-cover-image`"
                        />
                      </div>

                      <template #mask>
                        <div class="mask-contents">
                          <div
                            class="flex justify-center items-center text-white gap-1"
                            @click="onPreview(item)"
                          >
                            <Eye :size="16" />
                            <span>预览</span>
                          </div>
                        </div>
                      </template>
                    </vz-hover-mask>
                  </div>
                  <div
                    :class="`${prefixCls}-flex-contents-main-file-item-name`"
                  >
                    <div
                      :class="`${prefixCls}-flex-contents-main-file-item-name-checkbox`"
                    >
                      <a-checkbox
                        :value="item.id"
                        @change="onItemChange"
                        :disabled="calcDisabled(item.id)"
                      ></a-checkbox>
                    </div>
                    <div
                      :class="`${prefixCls}-flex-contents-main-file-item-name-name`"
                    >
                      <a-tooltip placement="bottomLeft">
                        <template #title>{{ item.name }}</template>
                        {{ item.name }}
                      </a-tooltip>
                    </div>
                  </div>
                </div>
              </a-space>
            </a-checkbox-group>
          </div>
        </div>

        <div :class="`${prefixCls}-flex-contents-footer`">
          <div>
            <a-space>
              <a-checkbox v-model:checked="checkCurrentPage">全选</a-checkbox>
              <a-button :disabled="true">删除</a-button>
              <a-button :disabled="true">移动</a-button>
            </a-space>
          </div>
          <div class="">
            <a-pagination
              v-bind="paginations"
              show-size-changer
              :responsive="true"
              show-quick-jumper
              @change="onPaginationChange"
            ></a-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a-modal
    v-model:open="previewing"
    title="预览"
    centered
    @ok="onPreviewCancel"
    @cancel="onPreviewCancel"
  >
    <div class="h-280px w-full">
      <div id="mse" ref="mseRef" class="w-full h-full"></div>
    </div>
  </a-modal>
  <a-modal
    v-model:open="uploading"
    title="上传"
    centered
    width="650px"
    @ok="onUploadCancel"
    @cancel="onUploadCancel"
  >
    <div class="h-full w-full">
      <VzUploaderUppy></VzUploaderUppy>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import type { VzExplorerProps } from "@viaz/types";

import { Eye } from "lucide-vue-next";

import { useStyle } from "@viaz/hooks";
import { ref } from "vue";
import { storeToRefs } from "pinia";

import Player from "xgplayer";
import "xgplayer/dist/index.min.css";
import HlsPlugin from "xgplayer-hls";

const { prefixCls } = useStyle("explorer");

const COMPONENT_NAME = "VzExplorer";
defineOptions({
  name: COMPONENT_NAME,
});

const viewMode = ref("list");
const checkCurrentPage = ref(false);

/**
 * 选择控制
 * @type {max: number, min: number}
 */
const controls = ref({
  max: 1,
  min: 1,
});

const previewing = ref(false);
const uploading = ref(false);

const currentPreview = ref({});

const { store } = defineProps<VzExplorerProps>();

const { getLists } = store;

const modelValue = defineModel<string[]>("value", { default: [] });

const { lists, paginations } = storeToRefs(store);

const current = ref({});

const emits = defineEmits(["change", "item-checked-change"]);

const filters = ref({
  page: 1,
  pageSize: 10,
  keywords: undefined,
});

store.getLists();
const calcDisabled = (itemId: string) => {
  if (
    modelValue.value.length === controls.value.max &&
    !modelValue.value.includes(itemId)
  ) {
    return true;
  } else {
    return false;
  }
};

const onUpload = () => {
  uploading.value = true;
};

const onUploadCancel = () => {
  uploading.value = false;
};

const mainplayer = ref<any>(null);

const onPreview = (item: any) => {
  console.info("item =>", item);
  currentPreview.value = item;

  previewing.value = true;

  setTimeout(() => {
    mainplayer.value = new Player({
      id: "mse",
      url: currentPreview.value.url,
      height: "100%",
      width: "100%",
      plugins: [HlsPlugin],
    });
    console.info("mainplayer =>", mainplayer);
  }, 500);
};

const onPreviewCancel = () => {
  mainplayer.value.destroy();
  previewing.value = false;
};

const onItemChange = (e: Event) => {
  const { value, checked } = e.target;
  let index = lists.value.findIndex((item) => item.id === value);

  current.value.item = lists.value[index];
  current.value.checked = checked;
};

const onCheckChange = (checkedValue: any) => {
  let checkedItems = lists.value.filter((item) => {
    return checkedValue.includes(item.id);
  });
  emits("change", checkedValue, checkedItems, current.value);
};

const onPaginationChange = (page: number, pageSize: number) => {
  filters.value.page = page;
  filters.value.pageSize = pageSize;
  getLists(filters.value);
};

const onSearch = () => {
  filters.value.page = 1;
  getLists(filters.value);
};
</script>

<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-explorer";

.@{prefix-cls} {
  // border: 2px solid red;
  width: 100%;
  height: 100%;
  &-flex {
    --at-apply: flex h-full;

    &-contents {
      --at-apply: flex-1 flex flex-col;
      &-header {
        --at-apply: flex justify-between items-center h-40px;
      }
      &-main {
        --at-apply: flex-1;
        &-file-item {
          width: 140px;

          &-cover {
            --at-apply: flex justify-center items-center;
            cursor: pointer;

            &-image {
              width: 140px;
              height: 120px;
              --at-apply: rd;
            }

            &-image {
              width: 100%;
              height: 100%;
              --at-apply: rd;
            }
          }

          &-name {
            // text-align: center;

            --at-apply: py-1 flex justify-between items-center;

            &-checkbox {
              --at-apply: px-1;
            }

            &-name {
              --at-apply: flex-1;
              display: inline-block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
      &-footer {
        --at-apply: flex justify-between items-center;
      }
      // background-color: gray;
      // opacity: 0.3;
    }
  }
}
</style>
