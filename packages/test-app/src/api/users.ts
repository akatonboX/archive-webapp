
import { createCollectionResourceApiMock } from "../common/lib/axiosRestApiMock";
import { apiMockConfig } from "./apiMock";

export interface User{
  id: string;
  name: string;
}

export const MOCK_DATA_USERS: User[] | undefined = apiMockConfig.isApiMockEnabled ?  (new Array(20)).fill(1).map((_, index) => {
  return {
    id: `${index}`,
    name: `山田太郎${index}`
  }
}) : undefined;

//■APIMockの作成
if(MOCK_DATA_USERS != null){
  apiMockConfig.axiosAdapterBuilder.append(createCollectionResourceApiMock<User, User>({
    data: MOCK_DATA_USERS,
    resourcePath: "/users",
    pathParameter: {name: "id", type: "string"},
    allowCreateWhenPut: false,
  }));
}