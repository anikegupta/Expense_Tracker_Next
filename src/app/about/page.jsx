import React from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white">
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <p className="text-cyan-300 uppercase tracking-[0.3em] text-sm mb-4">Expense tracking reimagined</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">A professional expense tracker built for clarity and control.</h1>
              <p className="mt-6 text-lg text-slate-200 max-w-3xl">
                Pocket Guard helps individuals and teams monitor spending, optimise budgets, and find savings with an elegant, data-driven dashboard. Every expense is organised, searchable, and easy to understand.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="inline-flex items-center justify-center rounded shadow-lg transition bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
                  Get Started
                </Link>
                {/* <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg shadow-lg transition bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  View Dashboard
                </Link> */}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-semibold mb-4">Trusted by proactive savers</h2>
              <p className="text-slate-200 leading-relaxed">
                The result is a streamlined workflow for tracking daily purchases, recurring bills, and long-term goals. Your finances stay aligned with the real world, not buried in spreadsheets.
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100">
                  <p className="text-sm uppercase tracking-[0.3em] mb-2 text-cyan-300">Fast setup</p>
                  <p className="text-sm text-slate-200">Add your first expense in seconds and review your spending immediately.</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 text-slate-100">
                  <p className="text-sm uppercase tracking-[0.3em] mb-2 text-cyan-300">Clear reports</p>
                  <p className="text-sm text-slate-200">Visual summaries help you spot trends and reduce overspending.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-1 text-sm uppercase tracking-[0.3em] text-cyan-200">What we track</span>
          <h2 className="mt-6 text-3xl md:text-4xl font-semibold">Every expense detail is recorded and organised.</h2>
          <p className="mt-4 text-blue-100">See the exact categories, payment methods, and status of every transaction in one polished interface.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold mb-3">Expense categories</h3>
            <p className="text-slate-200 text-sm">Organise spending by food, transport, bills, entertainment, and more.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold mb-3">Payment methods</h3>
            <p className="text-slate-200 text-sm">Track credit cards, cash, digital wallets, and recurring subscriptions.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold mb-3">Hidden expenses</h3>
            <p className="text-slate-200 text-sm">Hide items you don't want in the main dashboard, and restore them anytime.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold mb-3">Search & filters</h3>
            <p className="text-slate-200 text-sm">Find transactions quickly with filters for date, category, and amount.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div>
            <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-1 text-sm uppercase tracking-[0.3em] text-cyan-200">Why choose us</span>
            <h2 className="mt-6 text-3xl md:text-4xl font-semibold">Professional tools for confident budgeting.</h2>
            <p className="mt-5 text-blue-100 max-w-2xl leading-relaxed">
              Pocket Guard combines strong visual structure with useful automation, so you can focus on making decisions instead of organising notes. It�s engineered for people who want a premium expense experience without the extra complexity.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
              <h3 className="text-lg font-semibold mb-2">Smart suggestions</h3>
              <p className="text-slate-200 text-sm">Get tailored advice to lower recurring costs and keep your budget healthy.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
              <h3 className="text-lg font-semibold mb-2">Recovery mode</h3>
              <p className="text-slate-200 text-sm">Soft-deleted expenses stay recoverable, so nothing is lost permanently.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
              <h3 className="text-lg font-semibold mb-2">Budget forecasts</h3>
              <p className="text-slate-200 text-sm">Compare your spending trends and spot future savings opportunities.</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
              <h3 className="text-lg font-semibold mb-2">Secure access</h3>
              <p className="text-slate-200 text-sm">Your dashboard is protected with trusted sign-in and local data storage.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-1 text-sm uppercase tracking-[0.3em] text-cyan-200">Designed to deliver</span>
          <h2 className="mt-6 text-3xl md:text-4xl font-semibold">Core features that streamline every budget.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold text-white mb-3">Budget Planner</h3>
            <p className="text-slate-200 text-sm">Define limits, track progress, and stay within your spending targets.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold text-white mb-3">Insight Dashboard</h3>
            <p className="text-slate-200 text-sm">Understand where your money goes with real-time graphs and summaries.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-6 shadow-xl transition hover:-translate-y-1 hover:bg-white/15">
            <h3 className="text-xl font-semibold text-white mb-3">Export & Reporting</h3>
            <p className="text-slate-200 text-sm">Download your data or share reports with ease.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="rounded-3xl bg-white/5 p-6 shadow-lg">
            <summary className="cursor-pointer text-lg font-medium">Is my data stored securely?</summary>
            <p className="mt-3 text-slate-300 text-sm">Yes — data is stored locally by default, and any server sync is transmitted over secure HTTPS.</p>
          </details>
          <details className="rounded-3xl bg-white/5 p-6 shadow-lg">
            <summary className="cursor-pointer text-lg font-medium">Can I restore deleted items?</summary>
            <p className="mt-3 text-slate-300 text-sm">Yes — soft-deleted expenses move to the recycle bin so you can restore them later.</p>
          </details>
          <details className="rounded-3xl bg-white/5 p-6 shadow-lg">
            <summary className="cursor-pointer text-lg font-medium">Can I track recurring bills?</summary>
            <p className="mt-3 text-slate-300 text-sm">Yes — recurring payments are captured and shown as part of your budgeting overview.</p>
          </details>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-3">Ready to strengthen your budget?</h2>
          <p className="text-slate-200 mb-6">Join Pocket Guard and start tracking every expense with confidence.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center justify-center rounded shadow-lg transition bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
              Create account
            </Link>
            {/* <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg shadow-lg transition bg-white/10 px-7 py-3 text-sm font-semibold text-white hover:bg-white/20">
              Explore dashboard
            </Link> */}
          </div>
        </div>
      </section>
    </div>
  );
}
