/**
 * OIDCの認証の機構を同じinterfaceで利用できるようにするプロキシ。
 * クライアントは、useAuthentication()で認証オブジェクトを取得する。
 */

import React from "react";

export interface IdTokenClaims {
  __raw: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: string;
  updated_at?: string;
  iss?: string;
  aud?: string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  azp?: string;
  nonce?: string;
  auth_time?: string;
  at_hash?: string;
  c_hash?: string;
  acr?: string;
  amr?: string[];
  sub_jwk?: string;
  cnf?: string;
  sid?: string;
  org_id?: string;
  org_name?: string;
  [key: string]: any | undefined;
}

/**
 * 認証オブジェクトのインターフェース。
 * 実装は各認証機構毎に、実装する。
 */
export interface Authentication {
  /**
   * ログインする
   */
  login(): Promise<void>;

  /**
   * ログアウトする
   */
  logout(): void;

  /**
   * アクセストークンを取得する。存在しない場合は、undefiend
   */
  getAccessToken(): Promise<string | undefined>;

  /**
   * IDトークンを取得する。存在しない場合は、undefiend
   */
  getIdTokenClaims(): Promise<IdTokenClaims | undefined>;
  /**
   * ログイン済みかどうかを取得する
   */
  readonly isAuthenticated: boolean;
}


const LoginProviderContext = React.createContext<{
  useAuthentication: () => Authentication,
} | undefined>(undefined);


export interface InnerLoginProviderProps{
  children: React.ReactNode 
}

/**
 * 認証のためのプロバイダ。実際にはimplementationに指定したコンポーネントが動作する。
 * @param innerLoginProvider 実際に使用するプロバイダを含むコンポーネント
 * @param implementation 認証中の間に表示するコンポーネント。
 * @returns 
 */
export const LoginProvider = function (
  props: {
    implementation: {
      loginProvider: React.FC<{children: React.ReactNode}>,
      useAuthentication: () => Authentication,
    },
    children: React.ReactNode 
  }
) {
  return (
    <LoginProviderContext.Provider value={{useAuthentication: props.implementation.useAuthentication}}>
      <props.implementation.loginProvider>
        {props.children}
      </props.implementation.loginProvider>
    </LoginProviderContext.Provider>
  );
};

/**
 * 認証オブジェクトを取得するフック
 * @returns 
 */
export function useAuthentication(): Authentication {
  const contextValue = React.useContext(LoginProviderContext);
  if(contextValue == null) throw Error("LoginProviderContextが設定されていません。");
  return contextValue.useAuthentication();
}
