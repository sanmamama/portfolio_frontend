import React, { useState, useEffect } from 'react';
import SidebarContent from './SidebarContent';
import ContactForm from './ContactForm';

function Contact() {
    return (
      <div className="row">
		<div class="w-100">
        <h1>お問い合わせ</h1>
            <ContactForm />
      </div>
      </div>
    );
}

export default Contact;