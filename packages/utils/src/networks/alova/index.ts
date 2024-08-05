// import { createAlova } from "alova";
// import fetchAdapter from "alova/fetch";

// import type { ApiResponseData } from "@viaz/types";

// import VueHook from "alova/vue";

// export const alovaInstance = createAlova({
// 	baseURL: "/api",
// 	statesHook: VueHook,
// 	requestAdapter: fetchAdapter(),
// 	responded: {
// 		// 请求成功的拦截器
// 		onSuccess: async (response, method) => {
// 			console.info("responded.onSuccess => response", response);
// 			console.info("responded.onSuccess => method", method);

// 			// console.info("response.status =>", response.status);
// 			// 状态码 大于等于 400 抛出错误
// 			if (response.status >= 400) {
// 				throw new Error(response.statusText);
// 			}

// 			const json: ApiResponseData = await response.json();

// 			const { data, code, message } = json;


// 			if (code !== 0) {
// 				throw new Error(message);
// 			}

// 			return data;
// 		},
// 		// 请求失败的拦截器
// 		onError: (error, method) => {
// 			console.info("responded.onError => error", error);
// 			console.info("responded.onError => method", method);
// 		},

// 		// 请求完成的拦截器
// 		onComplete: async (method) => {
// 			console.info("responded.onComplete => method", method);
// 		},
// 	},
// });

// export default alovaInstance;
