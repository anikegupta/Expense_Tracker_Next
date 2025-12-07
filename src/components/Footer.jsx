import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="hidden lg:block w-full bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white shadow-inner z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-row justify-between items-start gap-12 lg:gap-20 text-left">
        {/* Brand + About */}
        <div className="flex flex-col gap-2 w-1/3">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent hover:drop-shadow-[0_2px_10px_rgba(255,255,255,0.7)] transition">Pocket Guard</h2>
          <p className="text-gray-300 text-sm md:text-base max-w-sm">
            A simple MERN app with AI assistance to track your daily expenses, analyze spending, and stay on budget.
          </p>
        </div>
        {/* Quick Links */}
        <div className="flex flex-col gap-2 w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent">Quick Links</h2>
          <ul className="text-gray-300 text-sm flex flex-col gap-1">
            <li><Link href="/" className="hover:text-cyan-400 transition">Home</Link></li>
            <li><Link href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
            <li><Link href="/login" className="hover:text-cyan-400 transition">Login</Link></li>
            <li><Link href="/signup" className="hover:text-cyan-400 transition">Signup</Link></li>
          </ul>
        </div>
        {/* Connect */}
        <div className="flex flex-col gap-2 w-1/3">
          <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-cyan-200 via-white to-cyan-400 bg-clip-text text-transparent">Connect</h2>
          <ul className="flex flex-col gap-2 text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="hover:text-cyan-400 transition" />
              <a href="mailto:aniketgupta3625@gmail.com" className="hover:text-cyan-400 transition">aniketgupta3625@gmail.com</a>
            </li>
            <li className="flex items-center gap-2">
              <Github size={16} className="hover:text-cyan-400 transition" />
              <a href="https://github.com/anikegupta" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">GitHub</a>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin size={16} className="hover:text-cyan-400 transition" />
              <a href="https://linkedin.com/in/aniket-gupta-84a203305" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-blue-700 py-3 text-center text-gray-300 text-sm">
        <p>
          © {new Date().getFullYear()} Pocket Guard | Developed by <span className="text-cyan-400 font-medium">Aniket Gupta</span>
        </p>
      </div>
    </footer>
  );
}
