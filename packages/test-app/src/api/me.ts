import { createSingletonResourceApiMock } from "../common/lib/axiosRestApiMock";
import { apiMockConfig } from "./apiMock";
import { MOCK_DATA_PROFILE } from "./profile";
import { MOCK_DATA_USERS } from "./users";

//■APIのリソースモデルの定義
export interface Me{
  id: string;
  name: string;
  nickName: string;
}

//■APIMockのデータを作成
export const MOCK_DATA_ME = apiMockConfig.isApiMockEnabled ? (() => {
  if(MOCK_DATA_USERS == null) throw new Error("MOCK_DATA_USERSがundefined");
  if(MOCK_DATA_PROFILE == null) throw new Error("MOCK_DATA_PROFILEがundefined");

  const profile = MOCK_DATA_PROFILE.find(item => item.userId === "3");
  return [{
    id: MOCK_DATA_USERS[0].id,
    name: MOCK_DATA_USERS[0].name,
    nickName: profile?.nickName,
  }]
})() : undefined;

//■APIMockの作成
if(MOCK_DATA_ME != null){
  apiMockConfig.axiosAdapterBuilder.append(createSingletonResourceApiMock({
    data: MOCK_DATA_ME,
    resourcePath: "/me",
    supportedActionTypes: ["get"],
  }));
}