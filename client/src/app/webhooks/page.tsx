import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function WebhooksPage() {
  return (
    <LegalPageLayout title="Webhook Portal" lastUpdated="May 12, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Real-time Event Streaming</h2>
        <p>TableTalk can push real-time events to your servers using webhooks. This is ideal for integrating TableTalk's AI intelligence directly into your POS system, CRM, or internal Slack channels.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4 mt-8">Supported Events</h2>
        <ul className="space-y-4 mt-4">
          <li className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b]">
            <code className="text-purple-400 font-mono text-sm block mb-2">review.intercepted</code>
            <p className="text-sm">Fired when a customer scans a QR code and submits a private review (1 to 3 stars) alerting the floor manager. Contains sentiment analysis payload.</p>
          </li>
          <li className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b]">
            <code className="text-purple-400 font-mono text-sm block mb-2">review.public_posted</code>
            <p className="text-sm">Fired when a 4 or 5-star review is successfully pushed to Google Maps or TripAdvisor by the SEO booster agent.</p>
          </li>
          <li className="bg-[#130b20] p-4 rounded-lg border border-[#1e293b]">
            <code className="text-purple-400 font-mono text-sm block mb-2">campaign.voucher_redeemed</code>
            <p className="text-sm">Fired when a customer successfully claims a retention apology voucher at your POS. Useful for calculating precise ROI.</p>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4 mt-8">Webhook Signatures</h2>
        <p>Every webhook payload includes a <code className="bg-[#1e293b] px-1.5 py-0.5 rounded text-sm text-gray-300">TableTalk-Signature</code> header. You should use your Webhook Secret (available in the Dashboard) to compute an HMAC-SHA256 signature of the payload and verify it against this header to ensure the event is genuine.</p>
      </section>
    </LegalPageLayout>
  );
}
