import React, { useState, useEffect } from 'react';
import SidebarContent from './SidebarContent';

function Contact() {
    return (
		<div>
        <h1>お問い合わせ</h1>
    				<form method="post">

        			<button class="btn btn-outline-primary btn-block" type="submit">送信</button>
    				</form>
      </div>
    );
}

export default Contact;