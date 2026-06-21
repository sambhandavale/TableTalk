import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function StatusPage() {
  const services = [
    { name: 'API Gateway', status: 'Operational', uptime: '99.99%' },
    { name: 'Review Ingestion Pipeline', status: 'Operational', uptime: '99.98%' },
    { name: 'LLM Inference Engine', status: 'Operational', uptime: '99.95%' },
    { name: 'Webhook Dispatcher', status: 'Operational', uptime: '100%' },
    { name: 'Dashboard Analytics', status: 'Operational', uptime: '99.99%' },
  ];

  return (
    <div className="min-h-screen bg-[#0c0516] text-[var(--foreground)] font-sans">
      <header className="w-full max-w-4xl mx-auto px-6 py-8 border-b border-[var(--brand-border-subtle)]">
        <a href="/" className="inline-flex items-center gap-2 text-xs text-[#94a3b8] hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </a>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">System Status</h1>
        <p className="text-sm text-[#10b981] flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          All Systems Operational
        </p>
      </header>

      <main className="w-full max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#130b20] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
          {services.map((service, index) => (
            <div key={service.name} className={`flex items-center justify-between p-5 ${index !== services.length - 1 ? 'border-b border-[#1e293b]' : ''}`}>
              <div>
                <h3 className="text-white font-bold">{service.name}</h3>
                <p className="text-xs text-[#64748b] mt-1">{service.uptime} uptime over the last 90 days</p>
              </div>
              <span className="text-xs font-bold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </main>

      <footer className="w-full border-t border-[#1e293b] py-8 mt-12 text-center text-xs text-[#64748b]">
        &copy; {new Date().getFullYear()} TableTalk AI.
      </footer>
    </div>
  );
}
