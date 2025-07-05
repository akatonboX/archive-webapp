import React from "react";
import { useLocation, useNavigate } from "react-router";

/**
 * <a>の代わりに使用するコンポーネント。<a>に展開されるが、hrefはonclickで処理される。
 * 右クリックで「別タブで開く」に対応。
 * targetに対応。
 * 
 * @param props 
 * @returns 
 */
export function Anchor(
  props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>
){
  const navigate = useNavigate();
  const location = useLocation();
  //■指定されたhrefの状態を調べる
  //navigatePath: react-routerのnavigateで使えるパス。navigateが不能ならnull。(ドメインから指定されている場合)
  //href: window.openで使用できるパス。
  const [navigatePath, href] = (() => {
    if(props.href == null){
      return [undefined, undefined];
    }
    else{
      try {
        new URL(props.href);
        return [props.href, props.href];
      } catch (e: unknown) {//ドメインの指定がない。
        if(props.href.startsWith("/")){//絶対パス
          return [props.href, `${import.meta.env.BASE_URL}${props.href.substring(1)}`];
        }
        else{//相対パス
          const url = new URL(props.href, window.origin + location.pathname);
          const path = `${url.pathname}${url.search}${url.hash}`;
          return [props.href, `${import.meta.env.BASE_URL}${path.substring(1)}`];
        }
      }
    }
   
  })();
  const currentOnClick = props.onClick;
  const newProps =  {
    ...props,
    href: href,
    onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      //■もともと指定されていたonclickを呼び出す
      if(currentOnClick != null){
        currentOnClick(e);
      }

      e.preventDefault();
      if(props.target == null){
        if(navigatePath == null){
          window.open(href, "_self");
        }
        else{
          navigate(navigatePath, { relative: 'path' });
        }
      }
      else{
        window.open(href, props.target);
      }
    }
  }
  return <a {...newProps} />;
}
