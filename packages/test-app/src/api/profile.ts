import { createSingletonResourceApiMock } from "../common/lib/axiosRestApiMock";
import { apiMockConfig } from "./apiMock";
import { MOCK_DATA_USERS } from "./users";

//■APIのリソースモデルの定義
export interface Profile{
  nickName: string;
}

//■APIMockのデータを作成
export const MOCK_DATA_PROFILE = apiMockConfig.isApiMockEnabled ? (() => {
  return MOCK_DATA_USERS?.map(item => {
    return {
      userId: item.id,
      nickName: item.name.substring(2),
    }
  });
})() : undefined;
type DataType = NonNullable<typeof MOCK_DATA_PROFILE>[number];

//■APIMockの作成
if(MOCK_DATA_PROFILE != null){
  apiMockConfig.axiosAdapterBuilder.append(createSingletonResourceApiMock<Profile, DataType>({
    data: MOCK_DATA_PROFILE,
    resourcePath: "/users/{userId}/profile",
    supportedActionTypes: ["get", "put"],
    allowCreateWhenPut: false,
    convert: data => {
      return {
        nickName: data.nickName,
      };
    },
  }));
}