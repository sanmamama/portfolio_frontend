import React, { useState, useEffect } from 'react';
import SidebarContent from './HomeSidebar';

function Portfolio() {
    return (
      <div className="col-sm-9">
              <div className="container container-m">
      <div className="row">
        <div>
        <span className="mt-0 mb-0 text-secondary">作成日：2024年5月18日　最終更新日：2024年5月18日</span>
				<h4 className="mt-1 mb-4">ポートフォリオ</h4>

				<p><a href="/">Myblog</a></p>
				<p>このブログです。</p>
				<p><a href="/postter">Postter</a></p>
				<p>X(旧Twitter)のようなSNSサイトです。</p>
        </div>
    </div></div>
    </div>
    );
}

export default Portfolio;