import React, { useState, useEffect } from 'react';
import SidebarContent from './SidebarContent';

function Portfolio() {
    return (
      <div className="col-sm-9">
              <div className="container container-m">
      <div className="row">
        <div>
				<h1>ポートフォリオ</h1>

				<p>作成日：2024年5月18日　最終更新日：2024年5月18日</p>

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