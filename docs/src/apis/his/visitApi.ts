import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';

import { Visit } from '@/models/modules/his/visitModel';

export const uri = 'hiss/v1/visits';

export const visitListsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<Visit[]>(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const visitDetailApi = (params: object & { id: string }, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<Visit>(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitUpdateApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
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

export const visitStoreApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const visitDeleteApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const visitRecoveryApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    { url: `${uri}/${params.id}/recovery`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const visitCuFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/forms`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitFilterFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filters`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitAllColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/columns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/defaultColumns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitSearcherSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/searcher`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitFilterSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filter`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const visitCuerSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/cuer`, params },
    {
      errorMessageMode: mode
    }
  );
};
