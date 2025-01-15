# ベースイメージ
FROM node:16-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# 開発サーバーのポートを開放
EXPOSE 3000

# ビルドしたアプリを提供
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
