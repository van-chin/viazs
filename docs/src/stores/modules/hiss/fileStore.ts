import { defineStore } from "pinia";
import type { Store, StoreDefinition } from "pinia";

import type {
  PiniaStore,
  PageCurdState,
  PageCurdGetters,
  PageCurdActions,
} from "@viaz/types";

import { state } from "@/stores/modules/curd/state";
import { getters } from "@/stores/modules/curd/getters";
import { actions } from "@/stores/modules/curd/actions";

import { store } from "@/stores";

import { useMessage } from "viaz";

import type { ExplorerFile } from "@/models/modules/his/fileModel";
//
import {
  fileListsApi,
  fileDetailApi,
  fileCuFormApi,
  fileUpdateApi,
  fileStoreApi,
  fileDeleteApi,
  fileRecoveryApi,
  fileFilterFormApi,
  fileSearcherSchemaApi,
  fileFilterSchemaApi,
  fileColumnsApi,
  fileAllColumnsApi,
} from "@/apis/his/fileApi";

interface FileState extends PageCurdState {
  lists: ExplorerFile[];
  currentData: any;
  allColumns: any[];
  itemCuForm: any;
}

type FileGetters = PageCurdGetters;

interface FileActions extends PageCurdActions {
  detail(id: string): void;
}

type FileStore = Store<"files", FileState, FileGetters, FileActions>;
type FileStoreDefinition = StoreDefinition<
  "files",
  FileState,
  FileGetters,
  FileActions
>;

const { createMessage } = useMessage();

const fileStore: PiniaStore<FileStore> = {
  // @ts-ignore
  state: () => ({
    // @ts-ignore
    ...state(),
    currentData: {},
    allColumns: [],
    apis: {
      searcherSchema: fileSearcherSchemaApi,
      filterSchema: fileFilterSchemaApi,
      columns: fileColumnsApi,
      lists: fileListsApi,
      filters: fileFilterFormApi,
      destroy: fileDeleteApi,
      recovery: fileRecoveryApi,
      cus: fileCuFormApi,
      update: fileUpdateApi,
      store: fileStoreApi,
      allColumns: fileAllColumnsApi,
    },
  }),
  getters: {
    ...getters,
  },
  actions: {
    ...actions,

    async detail(id: string) {
      const currentData = await fileDetailApi({ id });
      this.currentData = currentData;
    },

    async store(params: any) {
      const { code, message } = await fileStoreApi(params);
      if (code !== 0) {
        createMessage.warning(message);
        return false;
      }
      // 增加完成之后，重新请求数据
      this.getLists(this.filterForm.modelRef);
      return true;
    },
  },
};

// @ts-ignore
export const useFileStore: FileStoreDefinition = defineStore(
  "files",
  fileStore
);

export function useFileStoreWithOut() {
  return useFileStore(store);
}
