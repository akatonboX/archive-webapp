import React from "react";
import styles from "./pageLayout.module.scss";
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
      <div className={`${styles.root} ${styles.verticalDock}`}>
        <div>{/*ヘッダ-*/}
          <AppBar position="static" style={{backgroundColor: "#ffffff"}}>
            <Toolbar variant="dense">
              <div className={styles.toolbarLayout}>
                <div>
                  <button className={styles.iconButton} onClick={e => {setIsMenuOpen(true);}}>
                    <MenuOpenIcon />
                  </button>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div className={`${styles.verticalDock} ${styles.main}`}>{/*ページ*/}
          <div className={styles.horizontalDock}>{/*ページヘッダ*/}
            <div className={styles.pageTitle}> {/* タイトル */}
              <span><b>{props.title}</b></span> 
            </div>
            <div className={styles.main}> {/* ツールエリア.+ */}
              {props.toolsChildren}
            </div>
           
          </div>
          
          <div className={styles.main}>{/*ページボディ*/}
            {(props.isInitialized ?? true) ? props.children : <div />}
          </div>
        </div>
        <div>{/*フッター */}
          <div>Copyright © 株式会社アーカイブ All Rights Reserved.</div>
        </div>
      </div>
      <Drawer anchor="left" open={isMenuOpen} onClose={() => {setIsMenuOpen(false);}}>
        <div className={styles.menuRoot}>
          {!auth.isAuthenticated ? <button onClick={async () => {await auth.login();} }>ログイン</button> : <button onClick={async () => {await auth.logout();} }>ログアウト</button> }
          <Anchor href="/">home</Anchor>
          <Anchor href="/anchor/page1/">anchorPage</Anchor>
        </div>
      </Drawer>
    </>
  );
}