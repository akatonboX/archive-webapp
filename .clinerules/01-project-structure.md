# プロジェクト構造とファイル管理

## プロジェクト構造の概要
- RestAPIと、それを利用するWebAppのモノレポ構成です。
- RestAPIは、/apiフォルダに格納されます。PHP + laravelによる実装です。
- WebAppは、React + typescript + viteによるWebアプリケーションです。または、Webアプリケーションから参照される共通モジュールです。
- WebAppは、yarn workspaceで複数のサブプロジェクトに分かれます。このため、ルートはnpmプロジェクトになっており、packagesにサブプロジェクトが格納されます。

## WebAppの詳細な説明
### ディレクトリ構造
```
packages/
├── test-app/           # React + typescript + viteによるWebアプリケーションです。
├── ts-react-app-base/  # Webアプリケーションから参照される共通モジュールです。npmパッケージとして独立しています。
└── common/             # 共通モジュールです。これは、体裁上はnpmプロジェクトですが、Webアプリケーションからはsrc/commonにシンボリックリンクとして提供されています。
```

### Webアプリケーションのファイル配置ルール
- src/commonは、packages/common/srcへのシンボリックリンクです。実際は、packages/common/src内のファイルを修正します。
- ページのコンポーネントは`src/page/`に配置
- 部品のコンポーネントは`src/component/`に配置
- コンポーネントではないライブラリ、もしくは純粋なコンポーネントではないライブラリは`src/lib/`に配置
- APIクライアントは`src/api/`に配置

### commonのファイル配置ルール
- 型定義は`src/@type/`に配置
- APIクライアントは`src/api/`に配置
- 部品のコンポーネントは`src/component/`に配置
- コンポーネントではないライブラリ、もしくは純粋なコンポーネントではないライブラリは`src/lib/`に配置
- scssは`src/style/`に配置

### インポート順序
1. React関連のインポート
2. 外部ライブラリのインポート
3. 内部コンポーネントのインポート
4. 相対パスでのインポート
5. 型のインポート（`import type`）

### ファイル命名規則
- コンポーネントファイル: `componentName.tsx`
- フックファイル: `useHookName.ts`
- ユーティリティファイル: `utilityName.ts`
- 型定義ファイル: `types.d.ts`

### 環境設定ファイル
- 環境ごとに`.env.{environment}`ファイルを使用

### ローカル実行のコマンド
- ルートディレクトリで、yarnを使用して下さい。
- `yarn workspace test-app dev`でtest-appが起動します。`http://localhost:3000/test-app/`でアクセスして下さい。
- ポート番号は5173で起動します。

### module.scss
- 各コンポーネントは、対応するmodule.scssを持ちます。
- module.scssは、冒頭で、@useを用いて、共通のクラスをインポートしています。したがって、Pageコンポーネントで使用しているクラス名がなくても、共通のクラスは使用できます。
- 共通のクラスは、packages\common\src\style内の各ファイルで定義されています。
- 共通クラスは、 各ページコンポーネントのmodule.scss内で、再定義は不要です。