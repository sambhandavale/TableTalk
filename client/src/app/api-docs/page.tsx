import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function ApiReferencePage() {
  return (
    <LegalPageLayout title="API Reference" lastUpdated="April 20, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Base URL</h2>
        <pre className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b] text-sm text-[#c77dff] overflow-x-auto font-mono">
          <code>https://api.tabletalk.com/v1</code>
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
        <p>All API endpoints require a Bearer token in the Authorization header. You can generate an API key from your General Manager Control Hub under Developer Settings.</p>
        <pre className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b] text-sm text-[#94a3b8] mt-4 overflow-x-auto font-mono">
          <code>Authorization: Bearer sk_live_...</code>
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-8">Endpoints</h2>
        
        <div className="mb-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <span className="text-blue-400 text-xs font-mono bg-blue-400/10 border border-blue-400/20 px-2 py-1 rounded">GET</span> 
            /reviews
          </h3>
          <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">Retrieve a paginated list of all reviews intercepted by the private triage loops and scraped from public sources like Google Maps and Zomato.</p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <span className="text-green-400 text-xs font-mono bg-green-400/10 border border-green-400/20 px-2 py-1 rounded">POST</span> 
            /campaigns/dispatch
          </h3>
          <p className="mt-3 text-sm text-[#94a3b8] leading-relaxed">Programmatically dispatch a retention voucher via SMS or WhatsApp to a specific customer cohort based on their sentiment score and previous visit history.</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
