import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function DeveloperDocsPage() {
  return (
    <LegalPageLayout title="Developer Docs" lastUpdated="March 1, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Welcome to TableTalk Core</h2>
        <p>TableTalk Core is designed for modern restaurant aggregators, franchise groups, and enterprise F&B brands. By integrating our AI intelligence engine directly into your custom apps or POS software, you can automate customer recovery at an unprecedented scale.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4 mt-8">Getting Started</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li><strong>Generate an API Key:</strong> Log into your dashboard and navigate to Settings {'>'} API Keys.</li>
          <li><strong>Explore the Reference:</strong> Check out our <a href="/api-docs" className="text-[var(--brand-purple-text)] hover:underline font-medium">API Reference</a> to see the available REST endpoints.</li>
          <li><strong>Listen to Events:</strong> Setup your <a href="/webhooks" className="text-[var(--brand-purple-text)] hover:underline font-medium">Webhook endpoints</a> to receive real-time triage alerts to route directly to your kitchen display systems (KDS).</li>
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4 mt-8">SDKs and Libraries</h2>
        <p>We currently provide an official Node.js / TypeScript SDK to make interacting with the API completely typed and seamless.</p>
        <pre className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b] text-sm text-[#c77dff] mt-4 font-mono">
          <code>npm install @tabletalk/node</code>
        </pre>
      </section>
    </LegalPageLayout>
  );
}
