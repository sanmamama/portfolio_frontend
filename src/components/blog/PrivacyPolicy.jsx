//import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PrivacyPolicy() {
    return (
		<>
		<div className="col-sm-9">
              <div className="container container-m">

		<p className="mt-0 mb-0 text-secondary">最終更新日：2024年5月18日</p>

				<h3><b>プライバシーポリシー</b></h3>

				
				<h3 className="anchor" id="1"><b>1. 個人情報の収集について</b></h3>
				<hr/>
				<p>当ウェブサイトでは、ご利用者様の氏名、住所、電話番号、メールアドレスなどの個人情報を収集することがあります。これらの情報は、以下の目的で使用されます。</p>
				<p>
					<li>お問い合わせへの対応</li>
					<li>サービスの提供および運営</li>
					<li>利用者の承認および認証</li>
					<li>必要な情報のご連絡</li>
				</p>

				
				<h3 className="anchor" id="2"><b>2. 個人情報の利用について</b></h3>
				<hr/>
				<p>収集した個人情報は、以下の目的のために利用します。</p>
				<p>
					<li>ご利用者様からのお問い合わせに対する回答</li>
					<li>ご利用者様へのサービス提供およびサポート</li>
					<li>サービスの改善およびカスタマイズ</li>
					<li>法律や規制に基づく必要な対応</li>
				</p>

				<h3 className="anchor" id="3"><b>3. 個人情報の第三者提供について</b></h3>
				
				<hr/>
				<p>当ウェブサイトでは、以下の場合を除き、個人情報を第三者に提供することはありません。</p>
				<p>
					<li>ご利用者様の同意がある場合</li>
					<li>法律や規制に基づく場合</li>
					<li>ご利用者様や公共の安全を守るために必要である場合</li>
				</p>

				<h3 className="anchor" id="4"><b>4. 個人情報の管理について</b></h3>
				
				<hr/>
				<p>当ウェブサイトでは、個人情報の正確性および安全性を確保するために、適切な措置を講じます。個人情報への不正アクセス、紛失、破壊、改ざん、および漏洩を防止するためのセキュリティ対策を実施しています。</p>
				
				<h3 className="anchor" id="5"><b>5. クッキーについて</b></h3>
				
				<hr/>
				<p>当ウェブサイトでは、クッキー（Cookie）を使用しています。クッキーは、ウェブサイトの利用状況を分析し、サービスの向上を図るために使用されます。ご利用者様は、ブラウザの設定を変更することで、クッキーの受け入れを拒否することができますが、その場合、当ウェブサイトの一部機能が利用できなくなる可能性があります。</p>
					
				<h3 className="anchor" id="6"><b>6. プライバシーポリシーの変更について</b></h3>
				
				<hr/>
				<p>当ウェブサイトでは、プライバシーポリシーを適宜見直し、改善することがあります。変更があった場合は、本ページにてお知らせいたします。</p>
				
				<h3 className="anchor" id="7"><b>7. お問い合わせ</b></h3>
				
				<hr/>
				<p>プライバシーポリシーに関するお問い合わせは、以下の問い合わせフォームでお願いいたします。</p>
				<p>
				<p><Link to="/contact">問い合わせフォーム</Link></p>
				</p>

	  </div>
      </div>
	<div className="col-sm-3">
      <div>
        <h4>目次</h4>
        <p className="mt-3"><a href="#1">1. 個人情報の収集について</a></p>
        <p className="mt-3"><a href="#2">2. 個人情報の利用について</a></p>
        <p className="mt-3"><a href="#3">3. 個人情報の第三者提供について</a></p>
        <p className="mt-3"><a href="#4">4. 個人情報の管理について</a></p>
		<p className="mt-3"><a href="#5">5. クッキーについて</a></p>
		<p className="mt-3"><a href="#6">6. プライバシーポリシーの変更について</a></p>
		<p className="mt-3"><a href="#7">7. お問い合わせ</a></p>
      </div>
    </div>
	</>
    );
}

export default PrivacyPolicy;