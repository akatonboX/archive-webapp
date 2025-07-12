import { AxiosAdapterBuilder} from "../common/lib/axiosMock";


export const apiMockConfig = {
  isApiMockEnabled: import.meta.env.VITE_IS_ENABLE_API_MOCK === "true",
  axiosAdapterBuilder: new AxiosAdapterBuilder(),
  
};