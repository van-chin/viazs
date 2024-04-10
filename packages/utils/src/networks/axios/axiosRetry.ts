import { AxiosError, AxiosInstance } from 'axios';
import type { RetryInternalAxiosRequestConfig } from "@viaz/types";
/**
 *  请求重试机制
 */

export class AxiosRetry {
  /**
   * 重试
   */
  retry(axiosInstance: AxiosInstance, error: AxiosError) {
    // @ts-ignore
    // const { config  }         = error.response;
    const config = error.response?.config as RetryInternalAxiosRequestConfig;
    // @ts-ignore
    const { waitTime, count } = config?.requestOptions?.retryRequest;
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
      //请求返回后config的header不正确造成重试请求失败,删除返回headers采用默认headers
    // @ts-ignore
    delete config.headers;
    return this.delay(waitTime).then(() => axiosInstance(config));
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}
