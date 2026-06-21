import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="January 12, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
        <p>At TableTalk AI, your privacy is our top priority. We are committed to protecting your personal information and your customers' data. This Privacy Policy explains how we collect, use, and safeguard information when you use our services.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">2. Information We Collect</h2>
        <p>We may collect information including but not limited to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-2">
          <li>Account details (Name, email, business name, and contact information)</li>
          <li>Customer interaction data (Feedback inputs, scan times, interaction logs)</li>
          <li>Usage data to help us improve the platform's features and functionality</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">3. How We Use Information</h2>
        <p>The information we collect is used to provide our AI-driven customer intelligence, route feedback to appropriate channels, and send automated retention marketing campaigns on your behalf.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
        <p>We implement industry-standard security measures to ensure that your data is safe. Customer feedback loops and triage alerts are processed securely and access is restricted to authorized personnel and automated agents.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
        <p>If you have any questions or concerns regarding our privacy practices, please contact us at <a href="mailto:privacy@tabletalk.com" className="text-[var(--brand-purple-text)] hover:underline">privacy@tabletalk.com</a>.</p>
      </section>
    </LegalPageLayout>
  );
}
