"use client";

import { useState } from "react";
import Link from "next/link";

const steps = ["Brand", "Providers", "Prompts", "Review"] as const;
const providers = ["OpenAI", "Anthropic", "Gemini", "Perplexity"] as const;
const initialPrompts = [
  "Best coffee beans for pour-over",
  "Top ethical coffee brands",
  "Freshly roasted coffee subscriptions",
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState("Aster Vale Roasters");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([...providers]);
  const [prompts, setPrompts] = useState(initialPrompts.join("\n"));

  function toggleProvider(provider: string) {
    setSelectedProviders((current) => current.includes(provider)
      ? current.filter((item) => item !== provider)
      : [...current, provider]);
  }

  const promptCount = prompts.split("\n").filter((prompt) => prompt.trim()).length;

  return (
    <div className="wizard-card">
      <ol className="stepper" aria-label="Setup progress">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "current" : index < step ? "complete" : ""}>
            <span>{index < step ? "✓" : index + 1}</span><small>{label}</small>
          </li>
        ))}
      </ol>

      <div className="wizard-body" aria-live="polite">
        {step === 0 && (
          <div className="wizard-step">
            <span className="step-label">STEP 1 OF 4</span>
            <h2>Start with a brand profile</h2>
            <p>This name is used only to preview how monitoring prompts are framed.</p>
            <label className="field-label" htmlFor="brand">Brand name</label>
            <input id="brand" value={brand} onChange={(event) => setBrand(event.target.value)} maxLength={60} />
            <div className="example-card"><span className="coffee-avatar">A</span><div><strong>{brand || "Your brand"}</strong><small>Fictional demo profile</small></div></div>
          </div>
        )}

        {step === 1 && (
          <div className="wizard-step">
            <span className="step-label">STEP 2 OF 4</span>
            <h2>Choose comparison providers</h2>
            <p>Every provider uses a deterministic local adapter while demo mode is active.</p>
            <div className="provider-options">
              {providers.map((provider) => {
                const selected = selectedProviders.includes(provider);
                return <button key={provider} type="button" className={selected ? "selected" : ""} onClick={() => toggleProvider(provider)} aria-pressed={selected}><i>{provider[0]}</i><span><strong>{provider}</strong><small>Demo adapter</small></span><b>{selected ? "✓" : "+"}</b></button>;
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <span className="step-label">STEP 3 OF 4</span>
            <h2>Add the questions that matter</h2>
            <p>Use one prompt per line. The sample set is broad enough to show comparison behavior.</p>
            <label className="field-label" htmlFor="prompts">Prompts <small>{promptCount} total</small></label>
            <textarea id="prompts" rows={7} value={prompts} onChange={(event) => setPrompts(event.target.value)} />
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step review-step">
            <span className="step-label">STEP 4 OF 4</span>
            <h2>Your demo monitor is ready.</h2>
            <p>Nothing was saved or sent. This summary shows what a configured workspace would contain.</p>
            <dl>
              <div><dt>Brand</dt><dd>{brand || "Unnamed demo brand"}</dd></div>
              <div><dt>Providers</dt><dd>{selectedProviders.length}</dd></div>
              <div><dt>Prompts</dt><dd>{promptCount}</dd></div>
              <div><dt>Runtime</dt><dd><span className="demo-tag">Demo only</span></dd></div>
            </dl>
            <div className="review-callout"><span>◇</span><div><strong>Deterministic by design</strong><small>The same inputs produce the same sample results, making the public edition easy to test and evaluate.</small></div></div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <button className="text-button" type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0}>Back</button>
        {step < steps.length - 1 ? (
          <button className="primary-button" type="button" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))} disabled={(step === 0 && !brand.trim()) || (step === 1 && selectedProviders.length === 0) || (step === 2 && promptCount === 0)}>Continue <span>→</span></button>
        ) : (
          <Link className="primary-button" href="/">View demo dashboard <span>→</span></Link>
        )}
      </div>
    </div>
  );
}
