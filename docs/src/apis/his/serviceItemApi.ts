import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';

import { ServiceItem } from '@/models';

export const uri = 'hiss/v1/serviceItems';

export const serviceItemListsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<ServiceItem[]>(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const serviceItemDetailApi = (params: object & { id: string }, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<ServiceItem>(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemUpdateApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  const primaryKeyField = params.id;
  // delete params.id;
  return defHttp.put(
    { url: `${uri}/${primaryKeyField}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const serviceItemStoreApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const serviceItemDeleteApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const serviceItemRecoveryApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    { url: `${uri}/${params.id}/recovery`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const serviceItemCuFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/forms`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemFilterFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filters`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemAllColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/columns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/defaultColumns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemSearcherSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/searcher`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemFilterSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filter`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const serviceItemCuerSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/cuer`, params },
    {
      errorMessageMode: mode
    }
  );
};
