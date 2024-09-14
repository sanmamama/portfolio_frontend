# ポートフォリオ
画像を貼る

## アプリ概要
**ブログアプリ**  
説明

**SNSアプリ**  
説明

## アプリURL:  
**ブログアプリ**  
URL  

**SNSアプリ**  
URL  

## 開発背景
### 概要
**ブログアプリ**  
企業に自分のスキルを知ってもらい、技術力をPRするツールとしてブログアプリが最適な形式だと考え、アプリの開発を進めました。

**SNSアプリ**  
グローバルなSNSの可能性を探求するため、既存のXアプリを基にしたSNSアプリを開発しました。言語の壁を超え、全てのポストが自分の言語に翻訳されて表示される仕組みを取り入れることで、
より広範なコミュニケーションが可能になると考えました。このアイデアを実現するために、SNSアプリの特化を行いました。

### 課題
- 一人暮らしであり、自炊等で料理をする機会から必然的に献立を考えざるを得なくなることが多くなる
- ただ、献立を考える際に料理アプリで検索しても自分の難易度に合わないレシピを含めた沢山のものが出てきて、情報量が多くなってしまいがち
- よって献立をどうするか悩みやすく、決める手間というのは想像以上に多い
- そのようなことから料理自体が面倒になり、結果的に外食で済ますことや惣菜を買うといったことがあり、食費がかさんでしまうことに悩んでいる

### 解決方法
自分の作成経験のあるレシピ内で探すなど、あえて情報量を少なくして献立を考える手間を省く


## 機能一覧
- ログイン機能
- レシピ登録機能(編集含む)
- 自分のレシピ検索機能
- 他ユーザーのレシピ一覧
- 他ユーザーのレシピ検索機能
- プロフィール編集機能

## 画面紹介(一部)

|        **ホームページ**        |         **検索結果**          |      **ユーザー一覧**       |
|:---------------------------:|:--------------------------:|:---------------------------:|
| <img src="public/README2/index.png" alt="ホームページ" width="200"> | <img src="public/README2/search_result.png" alt="検索結果" width="200"> | <img src="public/README2/user_all.png" alt="レシピ一覧" width="200"> |
|        **レシピ登録**        |         **レシピ編集**         |         **レシピ詳細**         |
| <img src="public/README2/recipe_new.png" alt="レシピ登録" width="200"> | <img src="public/README2/recipe_edit.png" alt="レシピ編集" width="200"> | <img src="public/README2/recipe_show.png" alt="レシピ詳細" width="200"> |


## ER図
![ER図](public/README/er-image.png)

## インフラ構成図
![インフラ図](public/README/infra-image.png)

## 主な使用技術
| カテゴリー | 使用技術 | 
|:-----------|:------------|
| フロントエンド | HTML/CSS, JavaScript | 
| バックエンド | Ruby3.1.2, Rails7.0.6 |
| データベース | MySQL8.0.33 |
| 本番環境 | AWS（VPC, EC2, RDS, ALB, ACM, Route53, S3） |

## 工夫した点
<details>
  <summary>1.配列を活用した食材リストの一括操作</summary>
  
  - 食材を追加や編集を行う際に一つずつデータ処理するのではなく、配列を用いて一気に食材リストを登録や更新できるようにしました
</details>

<details>
  <summary>2.直感的に操作</summary>
  
  - ヘッダーに他のサイトなどでもよく見かけるアイコンを用いる等のことを行い直感的に操作できるようにしました
</details>

<details>
  <summary>3.手軽に献立を検索するコンセプト</summary>
  
  - ログイン直後のページで登録した自分のレシピの表示やすぐに検索をできるようにと、手軽に献立を検索するコンセプトに沿うようにしました。
</details>

<details>
  <summary>4.女性好みのデザイン配色</summary>
  
  - デザイン面でミントグリーンやオレンジ色などを使って、雰囲気を柔らかく女性の好みにも合致しやすいように配色を寄せました。
</details>
