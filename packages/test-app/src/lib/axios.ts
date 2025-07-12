
import _axios, { type AxiosRequestConfig } from "axios";
import { useAuthentication } from '../common/lib/authentication';
import { apiMockConfig } from '../api/apiMock';
import "../api"
/**
 * axiosのインスタンスを取得する。
 * @returns 
 */
export function useAxios(){

  const auth = useAuthentication();

  //■共通のaxiosのコンフィグを構成
  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 
      "Cache-Control": "no-store", 
      "Content-Type": "application/json",
    },
    adapter: apiMockConfig.isApiMockEnabled ? apiMockConfig.axiosAdapterBuilder.build() : undefined, //■mockの適用
    validateStatus: () => true,
  }
  //■axiosのインスタンス生成
  const axios = _axios.create(config);

  //■リクエストインターセプターの設定
  axios.interceptors.request.use(async request => {
    //■Authorizationヘッダを付与。
    if (auth != null && auth.isAuthenticated){
      const accessToken = await auth.getAccessToken();
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }

    //■ロギング用のヘッダを付与する。
    // request.headers.set("x-client-no", clientNo);
    return request;
  });

  return axios;
}