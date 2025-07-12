import { useAuthentication } from "../lib/authentication";
import React from "react";


/**
 * ページにログインページへのリダイレクト機能を与える
 */
export function AutoLogin(
  props: {
    children: React.ReactNode,
  }
){
  const auth = useAuthentication();
  auth.login();
  React.useEffect(() => {
    if(!auth.isAuthenticated){
      auth.login();
    }
  }, [auth.isAuthenticated]);
  return auth.isAuthenticated ? props.children : <></>;
}
