import Link from "next/link";
import { demoDashboard } from "@/lib/demo/fixtures";

const providers = demoDashboard.providers;

export default function DashboardPage() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark" aria-label="RentalRadar home">
          <span className="brand-symbol">R</span>
          <span>RentalRadar</span>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <a className="nav-item active" href="#overview"><span>⌂</span> Overview</a>
          <a className="nav-item" href="#providers"><span>◈</span> Providers</a>
          <a className="nav-item" href="#prompts"><span>◎</span> Prompt library</a>
          <a className="nav-item" href="#mentions"><span>↗</span> Mentions</a>
        </nav>
        <div className="sidebar-foot">
          <div className="demo-pill"><span /> Demo workspace</div>
          <Link href="/onboarding">Setup guide <span>→</span></Link>
        </div>
      </aside>

      <section className="workspace" id="overview">
        <header className="topbar">
          <div className="mobile-brand">RR</div>
          <div className="workspace-switcher">
            <span className="coffee-avatar">A</span>
            <div><strong>Aster Vale Roasters</strong><small>Demo workspace</small></div>
          </div>
          <div className="top-actions">
            <span className="status"><i /> Demo data</span>
            <Link className="button secondary" href="/onboarding">Configure</Link>
          </div>
        </header>

        <div className="content-wrap">
          <div className="hero-row">
            <div>
              <p className="eyebrow">AI VISIBILITY MONITOR</p>
              <h1>Good morning, Aster Vale.</h1>
              <p className="lede">Your brand appeared in 76% of tracked answers this week.</p>
            </div>
            <div className="period-control" aria-label="Selected reporting period">
              <span>Last 7 days</span><b>⌄</b>
            </div>
          </div>

          <section className="summary-grid" aria-label="Visibility summary">
            <article className="score-card primary-card">
              <div className="card-heading"><span>Visibility score</span><span className="trend positive">↗ 5.2%</span></div>
              <div className="score-line"><strong>76</strong><span>/100</span></div>
              <div className="progress"><span style={{ width: "76%" }} /></div>
              <p>Strong visibility across tracked providers</p>
              <div className="sparkline" aria-label="Score trended upward over seven days">
                {[34, 44, 40, 56, 51, 67, 76].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
              </div>
            </article>
            <article className="metric-card"><div className="metric-icon lavender">◎</div><div><span>Answer mentions</span><strong>38</strong><small><b>+8</b> from last week</small></div></article>
            <article className="metric-card"><div className="metric-icon mint">◈</div><div><span>Prompts tracked</span><strong>12</strong><small>Across 4 providers</small></div></article>
            <article className="metric-card"><div className="metric-icon peach">⌁</div><div><span>Avg. position</span><strong>2.4</strong><small><b>↑ 0.6</b> improvement</small></div></article>
          </section>

          <div className="dashboard-grid">
            <section className="panel provider-panel" id="providers">
              <div className="panel-title"><div><h2>Provider visibility</h2><p>Share of answers that mention Aster Vale</p></div><button type="button" aria-label="Provider panel menu">•••</button></div>
              <div className="provider-list">
                {providers.map((provider) => (
                  <div className="provider-row" key={provider.id}>
                    <div className={`provider-logo ${provider.tone}`}>{provider.name.slice(0, 1)}</div>
                    <div className="provider-name"><strong>{provider.name}</strong><span><i className={provider.tone} style={{ width: `${provider.score}%` }} /></span></div>
                    <b className="provider-score">{provider.score}%</b>
                    <span className={provider.change < 0 ? "delta negative" : "delta"}>{provider.change > 0 ? "+" : "−"}{Math.abs(provider.change)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel trend-panel" id="mentions">
              <div className="panel-title"><div><h2>Mention trend</h2><p>Weekly answer coverage</p></div><span className="legend"><i /> Mentions</span></div>
              <div className="chart-wrap">
                <div className="y-axis"><span>12</span><span>8</span><span>4</span><span>0</span></div>
                <div className="bar-chart">
                  {demoDashboard.mentionTrend.map((value, index) => (
                    <div className="bar-slot" key={index}><i style={{ height: `${value * 7.5}%` }} /><span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="dashboard-grid lower-grid">
            <section className="panel queue-panel" id="prompts">
              <div className="panel-title"><div><h2>Prompt queue</h2><p>Next scheduled checks</p></div><span className="count-pill">{demoDashboard.queuedPrompts.length} queued</span></div>
              {demoDashboard.queuedPrompts.map((prompt, index) => (
                <div className="prompt-row" key={prompt}>
                  <span className="prompt-state">{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{prompt}</strong><small>4 providers · {index === 2 ? "Tomorrow, 09:00" : `Today, ${index === 0 ? "10:00" : "14:00"}`}</small></div>
                  <span className="queued">Queued</span>
                </div>
              ))}
            </section>

            <section className="panel checklist-panel">
              <div className="panel-title"><div><h2>Get the most from Radar</h2><p>3 of 5 steps complete</p></div><span className="ring">60%</span></div>
              <div className="check-item done"><i>✓</i><span>Add your brand profile</span></div>
              <div className="check-item done"><i>✓</i><span>Select AI providers</span></div>
              <div className="check-item done"><i>✓</i><span>Create your first prompts</span></div>
              <Link className="check-item" href="/onboarding"><i>4</i><span>Review scoring preferences</span><b>→</b></Link>
              <Link className="check-item" href="/onboarding"><i>5</i><span>Run your first comparison</span><b>→</b></Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
