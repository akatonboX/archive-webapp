# ts-react-app-base

TypeScriptで作成されたReactUIコンポーネントライブラリです。

## 特徴

- TypeScript完全対応
- CSSモジュールでスタイル分離
- 再利用可能なUIコンポーネント
- カスタマイズ可能なプロパティ

## インストール

```bash
# プロジェクトのルートから
yarn install
```

## ビルド

```bash
# ライブラリをビルド
yarn workspace ts-react-app-base build

# 開発モード（ウォッチモード）
yarn workspace ts-react-app-base dev
```

## 含まれるコンポーネント

### Button

カスタマイズ可能なボタンコンポーネント

#### Props

- `children`: ボタンのテキスト
- `size`: ボタンサイズ (`'small' | 'medium' | 'large'`)
- `variant`: ボタンの種類 (`'primary' | 'secondary' | 'outline'`)
- `disabled`: 無効状態
- `onClick`: クリックイベントハンドラ

#### 使用例

```tsx
import { Button } from 'ts-react-app-base';

// 基本的な使用方法
<Button onClick={() => console.log('clicked')}>
  クリック
</Button>

// カスタマイズ例
<Button 
  size="large" 
  variant="outline" 
  onClick={handleClick}
>
  送信
</Button>
```

### Input

入力フィールドコンポーネント

#### Props

- `value`: 入力値
- `placeholder`: プレースホルダーテキスト
- `type`: 入力タイプ (`'text' | 'email' | 'password' | 'number'`)
- `size`: サイズ (`'small' | 'medium' | 'large'`)
- `disabled`: 無効状態
- `required`: 必須フィールド
- `error`: エラー状態
- `onChange`: 値変更イベントハンドラ
- `onFocus`: フォーカスイベントハンドラ
- `onBlur`: ブラーイベントハンドラ

#### 使用例

```tsx
import { Input } from 'ts-react-app-base';

// 基本的な使用方法
<Input 
  placeholder="名前を入力" 
  onChange={(e) => setName(e.target.value)}
/>

// エラー状態での使用
<Input 
  value={email}
  type="email"
  placeholder="メールアドレス"
  error={hasError}
  onChange={(e) => setEmail(e.target.value)}
/>
```

## 開発

### ファイル構成

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.module.css
│   └── Input/
│       ├── Input.tsx
│       └── Input.module.css
└── index.ts
```

### 新しいコンポーネントの追加

1. `src/components/` 下に新しいディレクトリを作成
2. コンポーネントファイル（`.tsx`）とスタイルファイル（`.module.css`）を作成
3. `src/index.ts` にエクスポートを追加
