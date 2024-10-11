//import React, { useState, useEffect } from 'react';

function Portfolio() {
    return (
      <div className="col-sm-9">
              <div className="container container-m">
      <div className="row">
        <div>
        <span className="mt-0 mb-0 text-secondary">最終更新日：2024年9月10日</span>
				<h3 className="mb-3"><b>ポートフォリオ</b></h3>

				<p><a href="/">さんまブログ</a></p>
        <div className="row">
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/blog.png`}
              width="200" 
              alt="blog"
            />
          </div>
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/post.gif`}
              width="200" 
              alt="post"
            />
          </div>
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/search.gif`}
              width="200" 
              alt="search"
            />
          </div>
        </div>
        
				<p>このブログです。一般的なブログアプリで、自身のプロフィールや学習記録、技術的な記事の発信のために開発しました。</p>
        <p>代表的な機能</p>
        <ul>
          <li>投稿作成・編集機能（Markdownサポート）</li>
          <li>記事をカテゴリーやタグで分類し、整理するカテゴリー・タグ機能</li>
          <li>ユーザーがブログ内の記事をキーワードで検索できる機能</li>
        </ul>
        <hr/>

				<p><a href="/postter">Postter</a></p>
        <div className="row">
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/postter.png`}
              width="200" 
              alt="postter"
            />
          </div>
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/translate.gif`}
              width="200" 
              alt="translate"
            />
          </div>
          <div className="col">
            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/message.gif`}
              width="200" 
              alt="message"
            />
          </div>
        </div>
        
        <p>多言語対応のSNSプラットフォームアプリです。ユーザーが投稿する内容を、DeepL APIを使用して自動的に複数の言語に翻訳し、他言語のユーザーにもシームレスに共有できるSNSアプリを開発しました。</p>
        <p>代表的な機能</p>
        <ul>
          <li>投稿作成時にDeepLを使って自動翻訳された内容をプレビュー</li>
          <li>翻訳された投稿に対するコメントやリプライも、自動的に投稿者の言語に翻訳</li>
          <li>言語選択機能によりユーザーが希望する言語（英語と日本語のみ対応）でフィードを閲覧可能</li>
        </ul>
        </div>
    </div></div>
    </div>
    );
}

export default Portfolio;