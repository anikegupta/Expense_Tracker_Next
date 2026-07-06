"use client";

import Link from "next/link";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="max-w-screen bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white shadow-inner overflow-x-hidden">
<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-10 text-center ">

    {/* Brand */}
    <div className="flex flex-col items-center ">
      <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent">
        Pocket Guard
      </h2>

      <p className="mt-3 text-gray-300 max-w-xs">
        A simple MERN app with AI assistance to track your daily expenses,
        analyze spending, and stay on budget.
      </p>
    </div>

    {/* Quick Links */}
    <div className="flex flex-col items-center ">
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent">
        Quick Links
      </h2>

      <div className="flex flex-col gap-2">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    </div>

    {/* Connect */}
    <div className="flex flex-col items-center ">
      <h2 className="text-xl font-semibold mb-3 bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent">
        Connect
      </h2>

      <div className="flex flex-col gap-3">

        <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=aniketgupta3625@gmail.com&su=Pocket%20Guard%20Support&body=Hi%20Aniket,%0A%0AI%20would%20like%20to%20contact%20you%20regarding%20Pocket%20Guard.%0A%0APlease%20find%20my%20query%20below:%0A%0A"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center lg:justify-start gap-2 hover:text-cyan-400 transition"
>

          <Mail size={16} />
          <span>Gmail</span>
        </a>

        <a
          href="https://github.com/anikegupta"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Github size={16} />
          <span>GitHub</span>
        </a>

        <a
          href="https://linkedin.com/in/aniket-gupta-84a203305"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center lg:justify-start gap-2 break-all"
        >
          <Linkedin size={16} />
          <span>LinkedIn</span>
        </a>

      </div>
    </div>

  </div>
</div>

      {/* Bottom */}
      <div className="border-t border-blue-700 py-3 text-center text-gray-300 text-sm">
        © {new Date().getFullYear()} Pocket Guard | Developed by{" "}
        <span className="text-cyan-400 font-medium">Aniket Gupta</span>
      </div>
    </footer>
  );
}