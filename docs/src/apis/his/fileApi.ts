import { defHttp } from "viaz";
import type { ErrorMessageMode } from "viaz";

import type { ExplorerFile } from "@/models/modules/his/fileModel";

export const uri = "/api/hiss/v1/files";

export const fileListsApi = (
  params = {},
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get<ExplorerFile[]>(
    { url: uri, params },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    }
  );
};

export const fileDetailApi = (
  params: object & { id: string },
  mode: ErrorMessageMode = "message"
) => {
  return defHttp.get<ExplorerFile>(
    { url: `${uri}/${params.id}`, params },
    {
      errorMessageMode: mode,
    }
  );
};

export const fileUpdateApi = (
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

export const fileStoreApi = (
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

export const fileDeleteApi = (
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

export const fileRecoveryApi = (
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

export const fileCuFormApi = (
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

export const fileFilterFormApi = (
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

export const fileAllColumnsApi = (
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

export const fileColumnsApi = (
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

export const fileSearcherSchemaApi = (
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

export const fileFilterSchemaApi = (
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

export const fileCuerSchemaApi = (
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
