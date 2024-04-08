import { defineStore } from 'pinia';
import type { Store, StoreDefinition } from 'pinia';

import type { CurdState } from './state';
import type { CurdGetters } from './getters';
import type { CurdActions } from './actions';

import { state } from './state';
import { getters } from './getters';
import { actions } from './actions';

import { store } from '@/stores';

export type CurdStore = Store<'curd', CurdState, CurdGetters, CurdActions>;

export type CurdStoreDefinition = StoreDefinition<'curd', CurdState, CurdGetters, CurdActions>;

// @ts-ignore
export const useCurdStore: CurdStoreDefinition = defineStore('curd', {
  // @ts-ignore
  state: () => ({ ...state() }),
  // @ts-ignore
  getters,
  actions
});

export function useCurdStoreWithOut() {
  return useCurdStore(store);
}
