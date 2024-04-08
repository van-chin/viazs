import { defineStore } from 'pinia';
import type { Store, StoreDefinition } from 'pinia';

import type { PiniaStore,PageCurdState,PageCurdGetters,PageCurdActions } from "@viaz/types";

import { state } from '@/stores/modules/curd/state';
import { getters } from '@/stores/modules/curd/getters';
import { actions } from '@/stores/modules/curd/actions';

import { store } from '@/stores';

import { useMessage } from 'viaz';

import type { Reservation } from '@/models/modules/his/reservationModel';
//
import {
  reservationListsApi,
  reservationDetailApi,
  reservationCuFormApi,
  reservationUpdateApi,
  reservationStoreApi,
  reservationDeleteApi,
  reservationRecoveryApi,
  reservationFilterFormApi,
  reservationSearcherSchemaApi,
  reservationFilterSchemaApi,
  reservationColumnsApi,
  reservationAllColumnsApi
} from '@/apis/his/reservationApi';

interface ReservationState extends PageCurdState {
  lists: Reservation[];
  currentData: any;
  allColumns: any[];
  itemCuForm: any;
}

type ReservationGetters = PageCurdGetters;

interface ReservationActions extends PageCurdActions {
  detail(id: string): void;
}

type ReservationStore = Store<'reservation', ReservationState, ReservationGetters, ReservationActions>;
type ReservationStoreDefinition = StoreDefinition<'reservation', ReservationState, ReservationGetters, ReservationActions>;

const { createMessage } = useMessage();

const reservationStore: PiniaStore<ReservationStore> = {
  // @ts-ignore
  state: () => ({
    // @ts-ignore
    ...state(),
    currentData: {},
    allColumns: [],
    apis: {
      searcherSchema: reservationSearcherSchemaApi,
      filterSchema: reservationFilterSchemaApi,
      columns: reservationColumnsApi,
      lists: reservationListsApi,
      filters: reservationFilterFormApi,
      destroy: reservationDeleteApi,
      recovery: reservationRecoveryApi,
      cus: reservationCuFormApi,
      update: reservationUpdateApi,
      store: reservationStoreApi,
      allColumns: reservationAllColumnsApi
    }
  }),
  getters: {
    ...getters
  },
  actions: {
    ...actions,

    async detail(id: string) {
      const currentData = await reservationDetailApi({ id });
      this.currentData = currentData;
    },

    async store(params: any) {
      const { code, message } = await reservationStoreApi(params);
      if (code !== 0) {
        createMessage.warning(message);
        return false;
      }
      // 增加完成之后，重新请求数据
      this.getLists(this.filterForm.modelRef);
      return true;
    }
  }
};

// @ts-ignore
export const useReservationStore: ReservationStoreDefinition = defineStore('reservation', reservationStore);

export function useReservationStoreWithOut() {
  return useReservationStore(store);
}
