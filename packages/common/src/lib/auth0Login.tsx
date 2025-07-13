import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import type { Authentication } from "./authentication";

export function createAuth0Login(
  domain: string, 
  clientId: string,
): {
    loginProvider: React.FC<{children: React.ReactNode}>,
    useAuthentication: () => Authentication,
}
{
  return {
    //ログインプロバイダコンポーネント
    loginProvider: (props: {children: React.ReactNode})=> {
      return (
        <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: window.location.origin
          }}
        >
          {props.children}
        </Auth0Provider>
      )
    },
    //useAuthenticationの実体
    useAuthentication: () => { 
      const auth0 = useAuth0();
      return {
        login: async () => {
          auth0.loginWithRedirect();
        },
        logout: () => {
          auth0.logout({ logoutParams: { returnTo: new URL(import.meta.env.BASE_URL, window.location.origin).toString()} });
        },
        getAccessToken: async () => await auth0.getAccessTokenSilently(),
        getIdTokenClaims: async () => await auth0.getIdTokenClaims(),
        isAuthenticated: auth0.isAuthenticated,
      }
    },
    
  }
    
}