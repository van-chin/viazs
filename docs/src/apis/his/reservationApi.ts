import { defHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';

import { Reservation } from '@/models/modules/his/reservationModel';

export const uri = 'hiss/v1/reservations';

export const reservationListsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<Reservation[]>(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const reservationDetailApi = (params: object & { id: string }, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<Reservation>(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationUpdateApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
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

export const reservationStoreApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const reservationDeleteApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const reservationRecoveryApi = (params: object & { id: number }, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    { url: `${uri}/${params.id}/recovery`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false
    }
  );
};

export const reservationCuFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/forms`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationFilterFormApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filters`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationAllColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/columns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationColumnsApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/defaultColumns`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationSearcherSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/searcher`, params },
    {
      errorMessageMode: mode
    }
  );
};

export const reservationFilterSchemaApi = (params = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    { url: `${uri}/filter`, params },
    {
      errorMessageMode: mode
    }
  );
};
