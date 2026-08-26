import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingWizard } from "./wizard";

export const metadata: Metadata = {
  title: "Demo setup | RentalRadar",
  description: "Explore a safe local setup flow for the RentalRadar public demo.",
};

export default function OnboardingPage() {
  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <Link href="/" className="brand-mark dark-brand" aria-label="RentalRadar dashboard">
          <span className="brand-symbol">R</span><span>RentalRadar</span>
        </Link>
        <Link href="/" className="back-link">← Back to dashboard</Link>
      </header>
      <section className="onboarding-content">
        <div className="onboarding-intro">
          <p className="eyebrow">DEMO-SAFE SETUP</p>
          <h1>Shape your visibility monitor.</h1>
          <p>This guided setup stays in your browser. It does not create accounts, call providers, or send the information anywhere.</p>
          <div className="safety-note"><span>✓</span><div><strong>Safe to explore</strong><small>Refresh the page to reset this local demo.</small></div></div>
        </div>
        <OnboardingWizard />
      </section>
    </main>
  );
}
