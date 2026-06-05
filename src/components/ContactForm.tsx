"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact Us: Message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:talk2bahl@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800/60"
    >
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Your Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors"
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors"
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none transition-colors resize-none"
          placeholder="How can we help?"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
      >
        Send Message
      </button>
    </form>
  );
}
