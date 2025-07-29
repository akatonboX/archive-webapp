import React from "react";
import { AppBar, Drawer, Toolbar } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Anchor } from "../common/component/anchor";
import { useAuthentication } from "../common/lib/authentication";

export function PageLayout(
  props: {
    title?: string,
    isInitialized?: boolean,
    toolsChildren?: React.ReactNode,
    children: React.ReactNode
  }
){
  const auth = useAuthentication();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <>
      <div className="l-dock-v bg-neutral-100">
        <div>{/*ヘッダ-*/}
          <AppBar position="static" style={{backgroundColor: "#ffffff"}}>
            <Toolbar variant="dense">
              <div>
                <div>
                  <button onClick={() => {setIsMenuOpen(true);}}>
                    <MenuOpenIcon />
                  </button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className="l-dock-v main m-2.5">{/*ページ*/}
          <div className="l-dock-h">{/*ページヘッダ*/}
            <div className="text-4xl mb-2.5"> {/* タイトル */}
              <span><b>{props.title}</b></span> 
            </div>
            <div className="main"> {/* ツールエリア.+ */}
              {props.toolsChildren}
            </div>
           
          </div>
          
          <div className="main">{/*ページボディ*/}
            {(props.isInitialized ?? true) ? props.children : <div />}
          </div>
        </div>
        <div>{/*フッター */}
          <div>Copyright © 株式会社アーカイブ All Rights Reserved.</div>
        </div>
      </div>
      <Drawer anchor="left" open={isMenuOpen} onClose={() => {setIsMenuOpen(false);}}>
        <div className="m-5 flex flex-col">
          {!auth.isAuthenticated ? <button onClick={async () => {await auth.login();} }>ログイン</button> : <button onClick={async () => {await auth.logout();} }>ログアウト</button> }
          <Anchor href="/">home</Anchor>
          <Anchor href="/anchor/page1/">anchorPage</Anchor>
        </div>
      </Drawer>
    </>
  );
}