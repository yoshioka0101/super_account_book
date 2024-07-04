# Super Account Book
- このプロジェクトは、Vite、Bun、Honoを使用して構築されたフルスタックアプリケーションです。フロントエンドはReactとTypeScriptで作成され、バックエンドはHonoを使用して構築されています。

## プロジェクトのセットアップ
### 前提条件
- Node.js（v14以降が推奨されます）
- Bun（インストールされていない場合は、こちらからインストールしてください）

### インストール手順
- リポジトリをクローンします。

```sh
git clone https://github.com/yourusername/super_account_book.git
cd super_account_book
プロジェクトの依存関係をインストールします。
```

```sh
bun install
cd frontend
bun install
cd ..
```

- プロジェクトを起動します。

```sh
bun run start
```


### ディレクトリ構造
```java
super_account_book/
├── .git/
├── .gitignore
├── README.md
├── app.ts
├── bun.lockb
├── index.ts
├── node_modules/
├── package-lock.json
├── package.json
├── server/
├── tsconfig.json
├── src/
│   └── index.ts
└── frontend/
    ├── .eslintrc.cjs
    ├── .gitignore
    ├── README.md
    ├── index.html
    ├── package.json
    ├── public/
    │   └── vite.svg
    ├── src/
    │   ├── App.css
    │   ├── App.tsx
    │   ├── assets/
    │   │   └── react.svg
    │   ├── index.css
    │   ├── main.tsx
    │   └── vite-env.d.ts
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    └── vite.config.ts
```

## 使用技術
- フロントエンド: Vite, React, TypeScript
- バックエンド: Hono

### フロントエンドの設定
フロントエンドはfrontendディレクトリに配置されています。Viteの設定ファイルはfrontend/vite.config.tsにあります。ここでは、Reactプラグインを使用し、開発サーバーのプロキシ設定を行っています。

### バックエンドの設定
バックエンドはsrcディレクトリに配置されています。ここでは、Honoを使用して簡単なAPIエンドポイントを定義しています。
