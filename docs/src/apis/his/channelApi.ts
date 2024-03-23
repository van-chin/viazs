import { defHttp } from "viaz";
import type { ErrorMessageMode } from "viaz";

import type { Channel } from "@/models/modules/his/channelModel";

export const uri = "hiss/v1/channels";

export const channelListsApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get<Channel[]>(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const channelDetailApi = (
  params: object & { id: string },
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get<Channel>(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelUpdateApi = (
  params: object & { id: number },
  mode: ErrorMessageMode = "message"
) => {
  const primaryKeyField = params.id;
  // delete params.id;
  return defHttp.put(
    { url: `${uri}/${primaryKeyField}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const channelStoreApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.post(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const channelDeleteApi = (
  params: object & { id: number },
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.delete(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const channelRecoveryApi = (
  params: object & { id: number },
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.put(
    { url: `${uri}/${params.id}/recovery`, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const channelCuFormApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/forms`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelFilterFormApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/filters`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelAllColumnsApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/columns`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelColumnsApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/defaultColumns`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelSearcherSchemaApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/searcher`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelFilterSchemaApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/filter`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const channelCuerSchemaApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get(
    { url: `${uri}/cuer`, params },
    {
      errorMessageMode: mode,
    }
  );
};
