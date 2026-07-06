"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const handleCancel = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        type: "error",
        message: "Email service is not configured.",
      });
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name,
          email,
          title: subject,
          message,
        },
        publicKey
      );

      setStatus({
        type: "success",
        message: "Thank you! Your feedback has been sent.",
      });

      handleCancel();
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send feedback right now.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 xl:gap-24 items-center">

          {/* Left Section */}

          <div className="space-y-8 text-center xl:text-left">

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Help us improve Pocket Guard.
              </h1>

              <p className="mt-5 text-slate-300 text-base sm:text-lg leading-8">
                Share your experience, request new features, or report bugs.
                Every suggestion helps us build a better expense tracker.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:p-8 backdrop-blur-xl shadow-xl">

              <h2 className="text-2xl font-semibold mb-4">
                What happens next?
              </h2>

              <p className="text-slate-300 leading-7">
                Your message is securely delivered through EmailJS directly to
                our inbox. We usually reply within one business day.
              </p>

            </div>

          </div>

          {/* Form */}

          <div className="w-full max-w-2xl mx-auto xl:mt-8 2xl:mt-0">

            <form
              onSubmit={handleSubmit}
              className="rounded-[30px] border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 shadow-2xl backdrop-blur-xl p-5 sm:p-6 lg:p-8"
            >

              <div className="space-y-5">

                <div>
                  <label className="block mb-2 font-medium">
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl bg-slate-900 border border-white/10 px-5 py-3.5 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-slate-900 border border-white/10 px-5 py-3.5 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Subject
                  </label>

                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e)=>setSubject(e.target.value)}
                    placeholder="Feature request, bug report..."
                    className="w-full rounded-2xl bg-slate-900 border border-white/10 px-5 py-3.5 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    required
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    placeholder="Tell us how we can improve Pocket Guard..."
                    className="w-full rounded-2xl resize-none bg-slate-900 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                  />
                </div>

                {status && (
                  <div
                    className={`rounded-xl px-4 py-3 ${
                      status.type === "success"
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:flex-1 rounded-xl bg-red-600 py-3.5 font-semibold hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:flex-1 rounded-xl bg-cyan-500 py-3.5 font-semibold text-slate-900 hover:bg-cyan-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSending ? "Sending..." : "Send Feedback"}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}