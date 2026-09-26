import BookList from './BookList';

function Profile() {
  return (
    <>
      <div className="col-sm-9">
        <div className="container container-m">
          <div className="row">
            <div className="col">

              <h3><b>プロフィール</b></h3>

              <p>
                <img
                  className="img-fluid"
                  src={`${process.env.REACT_APP_BASE_URL}/media/profile.jpg`}
                  alt="プロフィール"
                />
              </p>

              <p>
                <a
                  href="https://x.com/sanmamama_"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="me-2 align-baseline"
                    src={`${process.env.REACT_APP_BASE_URL}/media/icon/x_logo.png`}
                    width="32"
                    height="32"
                    alt="X"
                  />
                </a>

                <a
                  href="https://github.com/sanmamama/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="me-2 align-baseline"
                    src={`${process.env.REACT_APP_BASE_URL}/media/icon/github_logo.png`}
                    width="32"
                    height="32"
                    alt="GitHub"
                  />
                </a>
              </p>


              {/* 自己紹介 */}
              <h3 className="anchor" id="profile">
                <b>1. 自己紹介</b>
              </h3>
              <hr />

              <p>
                こんにちは！さんまままです。
              </p>

              <p>
                地方公務員として約10年間勤務した後、ITエンジニアへ転職しました。
                現在は業務システム・Webシステムの開発から、
                Windows Server・Linux・AWSなどのインフラ構築・運用まで幅広く携わっています。
              </p>

              <p>
                このブログでは、実務や資格学習、個人開発を通して得た知識を、
                自分自身の備忘録も兼ねて発信しています。
              </p>


              {/* 技術・経験 */}
              <h3 className="anchor" id="skills">
                <b>2. 技術・経験</b>
              </h3>
              <hr />

              <h5><b>実務</b></h5>
              <ul>
                <li>Java / Delphi / VB.NET</li>
                <li>PostgreSQL</li>
                <li>Windows Server / Active Directory</li>
                <li>Linux</li>
                <li>AWS</li>
                <li>業務システムの設計・開発・テスト・運用</li>
                <li>サーバ・ネットワーク環境の設計・構築・運用</li>
              </ul>

              <h5 className="mt-4"><b>個人開発</b></h5>
              <ul>
                <li>Python / Django / Django REST Framework</li>
                <li>JavaScript / React</li>
                <li>PostgreSQL</li>
                <li>Nginx</li>
                <li>Docker</li>
                <li>VPS上でのWebサービス構築・運用</li>
              </ul>

              <h5 className="mt-4"><b>その他の経験</b></h5>
              <ul>
                <li>C / C++</li>
                <li>Perl</li>
                <li>x86アセンブリ</li>
              </ul>


              {/* 資格 */}
              <h3 className="anchor" id="certifications">
                <b>3. 資格</b>
              </h3>
              <hr />

              <ul>
                <li>応用情報技術者</li>
                <li>情報処理安全確保支援士</li>
                <li>図書館司書</li>
              </ul>


              {/* 個人開発 */}
              <h3 className="anchor" id="development">
                <b>4. 個人開発</b>
              </h3>
              <hr />

              <p>
                Django / Django REST Framework / React / PostgreSQL / Nginx
                などを使用したWebサービスを個人で設計・開発し、VPS上で運用しています。
              </p>

              <p>
                フロントエンド・バックエンドだけでなく、
                データベースやWebサーバ、Docker、デプロイ環境なども含め、
                Webサービス全体を自分で構築・運用しています。
              </p>


              {/* 読書記録 */}
              <h3 className="anchor" id="books">
                <b>5. 読書記録</b>
              </h3>
              <hr />

              <BookList />

            </div>
          </div>
        </div>
      </div>


      {/* PC用目次 */}
      <div className="col-sm-3 d-none d-sm-block">
        <div className="stick">
          <h4>目次</h4>

          <p className="mt-3">
            <a href="#profile">1. 自己紹介</a>
          </p>

          <p className="mt-3">
            <a href="#skills">2. 技術・経験</a>
          </p>

          <p className="mt-3">
            <a href="#certifications">3. 資格</a>
          </p>

          <p className="mt-3">
            <a href="#development">4. 個人開発</a>
          </p>

          <p className="mt-3">
            <a href="#books">5. 読書記録</a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Profile;