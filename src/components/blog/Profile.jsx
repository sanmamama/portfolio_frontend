//import React, { useState, useEffect } from 'react';
import BookList from './BookList';
import { Link } from 'react-router-dom';

function Profile() {
    return (
      <>
      <div className="col-sm-9">
              <div className="container container-m">
      <div className="row">
        <div className="row">
			    <div className="col">
            <span className="mt-0 mb-0 text-secondary">最終更新日：2025年2月24日</span>
            <h3><b>プロフィール</b></h3>

            <img
              className="img-fluid"
              src={`${process.env.REACT_APP_BASE_URL}/media/profile.jpg`}
              alt="profile"
            />
            <Link to="https://x.com/sanmamama_">
                <img
                        className="me-2 align-baseline"
                        src={`${process.env.REACT_APP_BASE_URL}/media/icon/x_logo.png`}
                        width="32"
                        height="32"
                        alt="X_logo"
                />
            </Link>

            <Link to="https://github.com/sanmamama/">
                <img
                        className="me-2 align-baseline"
                        src={`${process.env.REACT_APP_BASE_URL}/media/icon/github_logo.png`}
                        width="32"
                        height="32"
                        alt="GitHub_logo"
                />
            </Link>

            <h3 className="anchor" id="1"><b>1.自己紹介</b></h3>
            
            <hr/>
            <p>こんにちは！さんまままと申します。</p>

            <p>1988年生まれ、北海道在住。大学を卒業後、地方公務員として10年間勤務し、1年半ほど主夫を経て今後エンジニアとして活動予定です。</p>

            <p>公務員時代に、業務効率化への関心からITに興味を持ち、2023年に応用情報技術者試験に合格、2024年に情報処理安全確保支援士試験合格。現在までC言語・C++・アセンブリ(8086,x86)・Perl・Java・JavaScript(React)、Python(Django)などを習得し、開発に取り組んできました。ユーザーに寄り添った、使いやすいシステムを作ることを目指しています。</p>



            <h3 className="anchor" id="2"><b>2.経歴</b></h3>
            
            <hr/>
            <p>
              <div className="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-1 wp-block-columns-is-layout-flex">
                  <div className="row">
                    <div className="col">
                      <p>2007年</p>
                      <p>2011年</p>
                      <p>2013年</p>
                      <p>2023年</p>
                      <p>現在に至る</p>
                    </div>
                    <div className="col">
                      <p>工業大学入学</p>
                      <p>工業大学卒業</p>
                      <p>町役場入庁</p>
                      <p>町役場退庁</p>
                    </div>
                  </div>
              </div>
            </p>
            <h3 className="anchor" id="3"><b>3.資格・スキル</b></h3>
            
            <hr/>
            <div className="row">
                    <div className="col">
                      <p>2009年</p>
                      <p>2020年</p>
                      <p>2023年</p>
                      <p>2024年</p>
                    </div>
                    <div className="col">
                      <p>普通自動車第一種免許取得</p>
                      <p>図書館司書資格取得</p>
                      <p>応用情報技術者試験合格</p>
                      <p>情報処理安全確保支援士試験合格</p>
                    </div>
            </div>

            <h3 className="anchor" id="4"><b>4.読書記録</b></h3> 
            <hr/>
            <BookList/>
        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col-sm-3 d-none d-sm-block">
      <div className="stick">
        <h4>目次</h4>
        <p className="mt-3"><a href="#1">1.自己紹介</a></p>
        <p className="mt-3"><a href="#2">2.経歴</a></p>
        <p className="mt-3"><a href="#3">3.資格・スキル</a></p>
        <p className="mt-3"><a href="#4">4.読書記録</a></p>
      </div>
    </div>
    </>
    );
}

export default Profile;