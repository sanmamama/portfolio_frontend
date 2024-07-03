import React, { useState, useEffect } from 'react';
import SidebarContent from './HomeSidebar';

function PrivacyPolicy() {
    return (
		<>
		<div className="col-sm-9">
              <div className="container container-m">

		<p class="mt-0 mb-0 text-secondary">作成日：2024年5月18日　最終更新日：2024年5月18日</p>

				<h4 class="mt-1 mb-4">プライバシーポリシー</h4>

				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="1"></a>
				<p><h5 class="mb-3 mt-4">1. 個人情報の収集について</h5></p>
				<p>当ウェブサイトでは、お客様の氏名、住所、電話番号、メールアドレスなどの個人情報を収集することがあります。これらの情報は、以下の目的で使用されます。</p>
				<p>
					<li>お問い合わせへの対応</li>
					<li>サービスの提供および運営</li>
					<li>利用者の承認および認証</li>
					<li>必要な情報のご連絡</li>
				</p>
				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="2"></a>
				<p><h5 class="mb-3 mt-4">2. 個人情報の利用について</h5></p>	
				<p>収集した個人情報は、以下の目的のために利用します。</p>
				<p>
					<li>お客様からのお問い合わせに対する回答</li>
					<li>お客様へのサービス提供およびサポート</li>
					<li>サービスの改善およびカスタマイズ</li>
					<li>法律や規制に基づく必要な対応</li>
				</p>
				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="3"></a>
				<p><h5 class="mb-3 mt-4">3. 個人情報の第三者提供について</h5></p>
				<p>当ウェブサイトでは、以下の場合を除き、個人情報を第三者に提供することはありません。</p>
				<p>
					<li>お客様の同意がある場合</li>
					<li>法律や規制に基づく場合</li>
					<li>お客様や公共の安全を守るために必要である場合</li>
				</p>
				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="4"></a>
				<p><h5 class="mb-3 mt-4">4. 個人情報の管理について</h5></p>
				<p>当ウェブサイトでは、個人情報の正確性および安全性を確保するために、適切な措置を講じます。個人情報への不正アクセス、紛失、破壊、改ざん、および漏洩を防止するためのセキュリティ対策を実施しています。</p>
				
				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="5"></a>
				<p><h5 class="mb-3 mt-4">5. クッキーについて</h5></p>
				<p>当ウェブサイトでは、クッキー（Cookie）を使用しています。クッキーは、ウェブサイトの利用状況を分析し、サービスの向上を図るために使用されます。お客様は、ブラウザの設定を変更することで、クッキーの受け入れを拒否することができますが、その場合、当ウェブサイトの一部機能が利用できなくなる可能性があります。</p>
					
				<a style={{ display: 'block', marginTop: '-40px', paddingTop: '40px' }} id="6"></a>
				<p><h5 class="mb-3 mt-4">6. プライバシーポリシーの変更について</h5></p>
				<p>当ウェブサイトでは、プライバシーポリシーを適宜見直し、改善することがあります。変更があった場合は、本ページにてお知らせいたします。</p>
				
				<a style={{ display: 'block', marginTop: '-50px', paddingTop: '50px' }} id="7"></a>
				<p><h5 class="mb-3 mt-4">7. お問い合わせ</h5></p>
				<p>プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。</p>
				<p>
				<li>[あなたの名前または会社名]</li>
				<li>[住所]</li>
				<li>[電話番号]</li>
				<li>[メールアドレス]</li>
				</p>

	  </div>
      </div>
	<div className="col-sm-3">
      <div>
        <h4>目次</h4>
        <p class="mt-3"><a href="#1">1. 個人情報の収集について</a></p>
        <p class="mt-3"><a href="#2">2. 個人情報の利用について</a></p>
        <p class="mt-3"><a href="#3">3. 個人情報の第三者提供について</a></p>
        <p class="mt-3"><a href="#4">4. 個人情報の管理について</a></p>
		<p class="mt-3"><a href="#5">5. クッキーについて</a></p>
		<p class="mt-3"><a href="#6">6. プライバシーポリシーの変更について</a></p>
		<p class="mt-3"><a href="#7">7. お問い合わせ</a></p>
      </div>
    </div>
	</>
    );
}

export default PrivacyPolicy;