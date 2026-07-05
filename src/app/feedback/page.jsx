"use client"

import { useState } from "react"
import emailjs from "@emailjs/browser"

export default function FeedbackPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState(null)
  const [isSending, setIsSending] = useState(false)

  const handleCancel = () => {
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setStatus(null)
  }

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: "error", message: "EmailJS is not configured. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY." })
      return
    }

    setIsSending(true)

    try {
      await emailjs.send(serviceId, templateId, {
  name,
  email,
  title: subject,
  message,
}, publicKey);

      setStatus({ type: "success", message: "Thank you! Your feedback has been sent." })
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
    } catch (error) {
      console.error("EmailJS send error:", error)
      setStatus({ type: "error", message: "Unable to send feedback right now. Please try again later." })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid gap-48 lg:grid-cols-[0.9fr_1.1fr] ">
          <div className="space-y-6 mt-10">
            {/* <span className="inline-flex rounded-full bg-cyan-500/20 px-4 py-1 text-sm uppercase tracking-[0.3em] text-cyan-200">Feedback & support</span> */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Help us improve Pocket Guard.</h1>
            <p className="max-w-2xl text-slate-300 leading-relaxed text-lg">
              Share your experience, request new features, or report issues. Your feedback helps us make the app easier to use and more powerful for everyday budgeting.
            </p>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mt-3 shadow-2xl backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-white mb-3">What happens next?</h2>
              <p className="text-slate-300 leading-relaxed ">
                Your message is routed securely through EmailJS and delivered directly to our support inbox. We typically respond within one business day.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="text-lg font-medium text-slate-200">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-lg font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label htmlFor="subject" className="text-lg font-medium text-slate-200">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="Feature request, bug report, or general feedback"
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div>
                <label htmlFor="message" className="text-lg font-medium text-slate-200">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={3}
                  placeholder="Tell us how we can improve Pocket Guard..."
                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/90 px-5 py-4 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              {status && (
                <div className={`rounded-3xl px-5 py-4 text-md ${status.type === "success" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                  {status.message}
                </div>
              )}

              <div className="flex gap-10 justify-between">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 items-center justify-center rounded bg-red-600 px-1 py-4 text-md font-semibold text-white transition hover:bg-red-700 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 inline-flex items-center justify-center rounded bg-cyan-500 px-1 py-4 text-md font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 hover:cursor-pointer"
                >
                  {isSending ? "Sending feedback..." : "Send feedback"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
