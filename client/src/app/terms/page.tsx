import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="February 28, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the TableTalk AI platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
        <p>TableTalk AI provides offline businesses with autonomous AI customer intelligence, private triage loops, and automated retention marketing services ("Service"). The Service is subject to continuous updates and improvements.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">3. User Responsibilities</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to use the platform in compliance with all applicable local, state, and federal laws, including consumer protection and privacy regulations.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">4. Limitation of Liability</h2>
        <p>TableTalk AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">5. Termination</h2>
        <p>We reserve the right to suspend or terminate your access to the platform at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the platform.</p>
      </section>
    </LegalPageLayout>
  );
}
