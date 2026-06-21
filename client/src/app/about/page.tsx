import React from 'react';
import LegalPageLayout from '../../components/LegalPageLayout';

export default function AboutPage() {
  return (
    <LegalPageLayout title="About TableTalk" lastUpdated="April 10, 2026">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Our Mission</h2>
        <p>TableTalk AI was built to solve a simple but critical problem: Offline businesses were losing customers to silent dissatisfaction. We believe that every complaint is a hidden opportunity for growth, provided it is caught in time. Our mission is to make offline business operations profoundly profitable by giving them the same powerful customer intelligence tools used by global e-commerce giants.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">What We Do</h2>
        <p>We provide a seamless AI-driven pipeline that intercepts negative feedback before it goes public, routes critical alerts to floor managers in real-time, and automatically dispatches retention marketing campaigns (like dynamic apology vouchers) to bring at-risk customers back to the table.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Our Story</h2>
        <p>Proudly engineered in Bengaluru and Mumbai, TableTalk AI started by observing the chaotic operations of busy local cafes and high-end clinics. We realized that managers simply didn't have the time to manually analyze feedback or run customized win-back campaigns. We built an autonomous agentic system to do the heavy lifting for them.</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">The Future</h2>
        <p>We are continuously expanding our platform's capabilities, from advanced multi-unit insights for franchise owners to predictive SEO map boosters that leverage positive sentiments. TableTalk is not just a feedback tool; it is your autonomous growth partner.</p>
      </section>
    </LegalPageLayout>
  );
}
