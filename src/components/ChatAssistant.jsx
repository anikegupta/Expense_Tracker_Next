"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { AiFillRobot } from "react-icons/ai";
import ExpenseView from "./user/ExpenseView";

function formatTime(dateLike) {
  const d = dateLike instanceof Date ? dateLike : new Date(dateLike);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your assistant Michael. Ask me anything about your expenses, budgets, or savings.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef(null);
  const textRef = useRef(null);

  const assistant = useMemo(
    () => ({
      name: "Michael",
      status: "Online",
      avatar: "🤖",
    }),
    []
  );

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    const ta = textRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  }, [input]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: text }),
      });

      if (!response.ok) throw new Error('Chat API error');
      const data = await response.json();

      const operation = data?.operation || "unknown";
      let content;

      if (operation === "list_expense") {
        const items = Array.isArray(data?.result) ? data.result : [];
        content = {
          type: "expenses",
          message: data?.message || "Here are the expenses I found:",
          items,
        };
      } else if (operation === "add_expense") {
        content = data?.message || "Expense added successfully.";
      } else {
        content = data?.advisor_message || data?.message || "I couldn't understand the request.";
      }

      const aiMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const aiMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I couldn't reach the assistant. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="rounded-[1.5rem] mx-auto border border-white/10 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 p-4 shadow-2xl text-white">
      <div className="px-4 sm:px-6 py-3 border-b border-white/6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center ring-1 ring-indigo-400/50">
            <AiFillRobot className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">{assistant.name}</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">{assistant.status}</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">Secure • Private • Fast</div>
      </div>

      <div ref={listRef} className="h-[60vh] overflow-y-auto px-3 sm:px-5 py-4 bg-transparent">
        <div className="space-y-3">
          {messages.map((m) => {
            const mine = m.role === "user";
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3 py-2 ${mine ? 'bg-cyan-500 text-slate-950' : 'bg-white/6 text-slate-100 ring-1 ring-white/10'}`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {typeof m.content === 'string' ? m.content : m.content?.type === 'expenses' ? (
                      <>
                        {m.content?.message && <div className="mb-2">{m.content.message}</div>}
                        {Array.isArray(m.content.items) && m.content.items.length > 0 ? (
                          <div className="space-y-3">
                            {m.content.items.map((exp, idx) => (
                              <ExpenseView key={exp?._id || idx} expense={exp} removeExpense={() => {}} onUpdateExpense={() => {}} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-200">No expenses found.</div>
                        )}
                      </>
                    ) : (
                      m.content?.text ?? ''
                    )}
                  </div>
                  <div className="mt-1.5 text-[10px] text-white/70">{formatTime(m.timestamp)}</div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-3 py-2 bg-white/6 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <div className="mt-1.5 text-[10px] text-white/60">typing…</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 sm:px-5 py-3 border-t border-white/10 bg-slate-900/80">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea ref={textRef} value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={onKeyDown} rows={1} placeholder="Message the assistant…" className="w-full resize-none rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white" />
            <div className="mt-1 text-[11px] text-white/60">Press Enter to send • Shift + Enter for new line</div>
          </div>
          <button onClick={sendMessage} disabled={!input.trim()} className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 shadow-sm ring-1 ring-white/10 transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed mb-5 cursor-pointer" title="Send" aria-label="Send message">
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
