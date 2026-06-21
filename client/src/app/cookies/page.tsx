import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="January 15, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">1. What Are Cookies?</h2>
        <p>Cookies are small text files that are stored on your device when you visit our website or use our platform. They help us understand how you use TableTalk AI and allow us to provide a better, more personalized experience.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li><strong>Essential Cookies:</strong> Required to authenticate users and prevent fraudulent use of user accounts.</li>
          <li><strong>Performance Cookies:</strong> Used to track how our platform is being used so we can improve its functionality.</li>
          <li><strong>Functionality Cookies:</strong> Allow us to remember your preferences, such as theme settings (Light/Dark mode) and dashboard configurations.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">3. Managing Your Cookies</h2>
        <p>You can control or delete cookies through your browser settings. However, please note that disabling essential cookies may impact your ability to access the General Manager Control Hub and other core platform features.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
        <p>We may use third-party services (such as analytics providers) that may also place cookies on your device. These cookies are governed by the privacy policies of the respective third-party providers.</p>
      </section>
    </LegalPageLayout>
  );
}
