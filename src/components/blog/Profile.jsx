import React, { useState, useEffect } from 'react';
import SidebarContent from './HomeSidebar';

function Profile() {
    return (
      <>
      <div className="col-sm-9">
              <div className="container container-m">
      <div className="row">
        <div class="row">
			    <div class="col">
            <span class="mt-0 mb-0 text-secondary">作成日：2024年5月18日　最終更新日：2024年5月28日</span>
            <h4 class="mt-1 mb-4">プロフィール</h4>

            <a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="1"></a>
            <h5 class="mb-3 mt-3"><b>自己紹介</b></h5>
            <p>こんにちは！あじと申します。</p>

              <p>
                私は大学卒業後、地方公務員として10年間、町役場で一般行政事務に従事しました。住民対応や各種行政手続きのサポートを通じて、対人スキルと問題解決能力を磨いてきました。具体的には、住民からの問い合わせ対応や、イベントの企画・運営、書類作成・管理など、多岐にわたる業務を担当してきました。これにより、複数のタスクを効率的にこなし、チームで協力して目標を達成する力を養うことができました。
              </p>
              <p>
                仕事以外では、読書が趣味で、新しい発想や考え方に触れることが大好きです。特に、技術書やビジネス書、フィクションなど幅広いジャンルの本を読んでいます。読書を通じて得た知識や視点を日常生活や仕事に活かし、常に自己成長を図ることを心掛けています。
              </p>
              <p>
                そんな私がシステム開発に興味を持つようになったのは、地方公務員として働く中で感じた業務効率化の必要性や、IT技術の進化に対する関心からです。2023年春に応用情報技術者試験に合格し、退職を機に2023年8月から本格的にWebエンジニアリングの学習を始めました。現在、学習期間は3ヶ月ほど、開発期間は5ヶ月になります。
              </p>
              <p>
                学習の過程では、HTML、CSS、JavaScriptなどの基本的なフロントエンド技術を習得し、さらにDjangoを用いたバックエンド開発にも取り組んできました。これにより、フルスタックな開発スキルを身につけ、ユーザーフレンドリーなウェブアプリケーションの構築に自信を持っています。
              </p>
              <p>
                私の目標は、これまでの公務員としての経験と、Webエンジニアとしての新たなスキルを融合させ、ユーザーのニーズに応える革新的なソリューションを提供することです。
              </p>


            <a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="2"></a>
            <h5 class="mb-3 mt-3"><b>自己PR</b></h5>
              <p>
                私は10年間にわたり地方公務員として住民対応や行政手続きのサポートを行い、多岐にわたる業務を通じて高い対人スキルと問題解決能力を身につけました。この経験を活かし、システム開発の分野で新しい価値を提供したいと考えています。
              </p>
              <p>
                特に、住民対応の際に求められる細やかなコミュニケーション能力と、迅速かつ正確に問題を解決するスキルは、ユーザーフレンドリーなウェブアプリケーションの設計・開発において大いに役立つと信じています。また、応用情報技術者試験に合格したことで得た理論的な知識を実践に活かし、効率的で高品質なコードを書くことを目指しています。
              </p>
              <p>
                さらに、独学での学習を通じて自己管理能力と継続的な学習意欲を高め、Webエンジニアとしてのスキルを磨いてきました。現在、HTML、CSS、JavaScriptなどの基本的なフロントエンド技術から、Djangoを用いたバックエンド開発に至るまで、幅広い技術を習得しています。
              </p>
              <p>
                現在は、さらなるスキルアップを目指し、情報処理安全確保支援士試験の合格に向けて勉強中です。この資格取得を通じて、セキュリティ面での知識とスキルを強化し、安全で信頼性の高いウェブアプリケーションを開発できるエンジニアを目指しています。
              </p>
              <p>
                これまでの公務員としての経験と、現在進行中のエンジニアとしての学びを融合させ、ユーザーのニーズに応えるための革新的なソリューションを提供できるエンジニアを目指しています。
              </p>

            <a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="3"></a>
            <h5 class="mb-3 mt-3"><b>経歴</b></h5>
            <p>
              <div class="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-1 wp-block-columns-is-layout-flex">
                <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
                <p>1988年7月23日</p>
                <p>2007年4月</p>
                <p>2011年3月</p>
                <p>2013年4月</p>
                <p>2024年8月15日</p>
                <p>現在に至る</p>
                </div>
                <div class="wp-block-column is-layout-flow wp-block-column-is-layout-flow">
                <p>北海道釧路市生まれ</p>
                <p>北海道工業大学工学部情報ネットワーク工学科入学</p>
                <p>北海道工業大学工学部情報ネットワーク工学科卒業</p>
                <p>北海道標津郡標津町役場入庁</p>
                <p>北海道標津郡標津町役場退庁</p>
                </div>
                </div>
            </p>
            <a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="4"></a>
            <h5 class="mb-3 mt-3"><b>資格・スキル</b></h5>
            <p>応用情報技術者試験合格、司書、普通自動車免許</p>

        </div>
      </div>
    </div>
    </div>
    </div>
    <div className="col-sm-3">
      <div>
        <h4>目次</h4>
        <p class="mt-3"><a href="#1">自己紹介</a></p>
        <p class="mt-3"><a href="#2">自己PR</a></p>
        <p class="mt-3"><a href="#3">経歴</a></p>
        <p class="mt-3"><a href="#4">資格・スキル</a></p>
      </div>
    </div>
    </>
    );
}

export default Profile;