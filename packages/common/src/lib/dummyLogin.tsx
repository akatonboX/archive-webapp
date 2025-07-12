/**
 * ダミー動作をするLoginProvider。
 */
import React from 'react';
import type { Authentication } from './authentication';

/** statusで管理されるダミーのログイン情報　*/
interface Login{
  userName: string;
  idToken: string;
}
/** 
 * ダミーのログインプロバイダやログインページなどの構築に提供するツール。
 **/
interface DummyLoginTools{
  /** ダミーのログイン情報を格納 */
  setLogin: (userName: string, idToken: string) => void;
  /** ダミーのログイン情報をクリア */
  removeLogin: () => void;
  /** ログイン情報 */
  login?: Login;
}
/**
 * DummyLoginToolを配信するためのコンテキスト
 */
const DummyLoginToolsContext = React.createContext<DummyLoginTools | undefined>(undefined);

/**
 * DummyLoginToolを使用するためのhook 
 */
export function useDummyLoginTools(){
  const dummyLoginTools = React.useContext(DummyLoginToolsContext);
  if(dummyLoginTools == null) throw Error("dummyLoginToolsがありません。");
  return dummyLoginTools
}

/**
 * 
 * @param appName アプリケーションの名前
 * @param loginPagePath 
 * @returns 
 */
export function createDummyLogin(
  option: {
    appName: string, 
    createAccessToken?: (login: Login) => string,
    loginPagePath?: string
  }
): {
    loginProvider: React.FC<{children: React.ReactNode}>,
    useAuthentication: () => Authentication,
}
{
  const localStrageName = `dummy-login-provider-${option.appName}`;
  const loginPageFulPath = (() => {
    const path = option.loginPagePath ?? "dummy-login";
    return `${import.meta.env.BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;
  })();
  const createAccessToken = option.createAccessToken ?? ((login: Login) => login.userName);
  return {
    //ログインプロバイダコンポーネント
    loginProvider: (props: {children: React.ReactNode})=> {
      //■ログイン情報を得る。初期はローカルストレージから取得
      const [login, setLogin] = React.useState<Login | undefined>((() => {
        const temp  = localStorage.getItem(localStrageName);
        return temp == null ? undefined : JSON.parse(temp);
      })());

      //■DummyLoginToolsの構築
      const dummyLoginTools: DummyLoginTools = {
        setLogin: (userName: string, idToken: string) => {
          setLogin({
            userName: userName, 
            idToken: idToken
          });
          if(login != null){
            localStorage.setItem(localStrageName, JSON.stringify(login));
          }
        },
        removeLogin: () => {
          setLogin(undefined);
          localStorage.removeItem(localStrageName);
        },
        login: login,
      };
      return (
        <DummyLoginToolsContext.Provider value={dummyLoginTools}>
          {props.children}
        </DummyLoginToolsContext.Provider>
      )
    },
    //useAuthenticationの実体
    useAuthentication: () => { 
      const dummyLoginTools = useDummyLoginTools();
      return {
        login: async () => {
          //■ダミーのログインページへ遷移
          const targetLocation = window.location.href.substring(window.location.origin.length);
          document.location.href = `${loginPageFulPath}?next=${encodeURIComponent(targetLocation)}`;
        },
        logout: () => {
          document.location.href = `${import.meta.env.BASE_URL}`;
          dummyLoginTools.removeLogin();
        },
        getAccessToken: async () => dummyLoginTools.login == null ? undefined : createAccessToken(dummyLoginTools.login),
        getIdTokenClaims: async () => dummyLoginTools.login?.idToken ?? {},
        isAuthenticated: dummyLoginTools.login != null,
      }
    },
    
  }
    
}

export function DummyLoginPage(){
  const dummyLoginTools = useDummyLoginTools();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [idToken, setIdToken] = React.useState('{\n  "name": "テストユーザー"\n}');
  const [error, setError] = React.useState<string | null>(null);

  // nextパラメータ取得
  const searchParams = new URLSearchParams(window.location.search);
  const next = searchParams.get('next') ?? '/';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ダミー認証: user/passwordのみOK
    
    //■ユーザーとパスワードの入力チェック
    if (username !== password) {
      setError('ユーザー名またはパスワードが正しくありません');
      return;
    }
    //■jsonの入力チェック
    try {
      JSON.parse(idToken);
    } 
    catch (err) {
      setError('idtokenは正しいJSON形式で入力してください。');
      return;
    }

    dummyLoginTools.setLogin(username, idToken);
    window.location.href = next;
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>ダミーログイン</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            ユーザー名
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              autoComplete="username"
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
              autoComplete="current-password"
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            idtoken (JSON形式)
            <textarea
              value={idToken}
              onChange={e => setIdToken(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4, minHeight: 80, fontFamily: 'monospace' }}
              placeholder={`{\n  "sub": "user1",\n  "name": "テストユーザー"\n}`}
              autoComplete="off"
            />
          </label>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
        )}
        <button type="submit" style={{ width: '100%', padding: 10 }}>
          ログイン
        </button>
      </form>
      <div style={{ marginTop: 16, color: '#888', fontSize: 12 }}>
        このページは、ダミーのログインページです。<br/>
        ユーザー名とパスワードが一致したとき、ログインが成功します。<br/>
        idtokenはJSON形式で入力してください。
      </div>
    </div>
  );
}
