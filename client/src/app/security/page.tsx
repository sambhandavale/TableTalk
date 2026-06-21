import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function SecurityStandardsPage() {
  return (
    <LegalPageLayout title="Security Standards" lastUpdated="March 5, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">1. Our Commitment to Security</h2>
        <p>TableTalk AI handles sensitive customer feedback and operational data. We treat your data security as a fundamental pillar of our architecture. We employ enterprise-grade security protocols to protect all data processing, storage, and transit.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">2. Data Encryption</h2>
        <p>All data transmitted between your physical stores, our cloud architecture, and the AI processing agents is encrypted in transit using TLS 1.3. Data at rest in our databases is encrypted using AES-256 encryption standards.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">3. AI Agent Security</h2>
        <p>Our autonomous triage and response agents process data in isolated, stateless environments. No customer data is used to train foundational LLMs, ensuring that your business intelligence remains strictly proprietary.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">4. Compliance & Audits</h2>
        <p>We regularly conduct third-party penetration testing and vulnerability assessments on our core infrastructure. We are continuously working towards expanding our compliance certifications to meet global standards.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">5. Reporting Vulnerabilities</h2>
        <p>If you believe you have discovered a security vulnerability in our platform, please report it immediately to <a href="mailto:security@tabletalk.com" className="text-[var(--brand-purple-text)] hover:underline">security@tabletalk.com</a>. We take all reports seriously and will investigate promptly.</p>
      </section>
    </LegalPageLayout>
  );
}
