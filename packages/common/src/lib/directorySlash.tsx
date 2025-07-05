import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

/**
 *　apacheのDirectorySlashディレクティブのように、末尾の"/"を強制するコンポーネント
 */
export function DirectorySlash(){
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if(!location.pathname.endsWith("/")){
      navigate(`${location.pathname}/${location.search}${location.hash}`, { replace: true });
    }
  }, [location.pathname]);

  // const { pathname, search, hash } = window.location;
  // React.useEffect(() => {
  //   const newUrl = `${pathname}/${search}${hash}`;
  //   window.history.replaceState(null, "", newUrl);
  // }, [pathname]);
  return <></>;
}