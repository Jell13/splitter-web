"use client";

import React, { useState } from "react";
import { NameEntryPromptProp } from "../lib/types";

const NameEntryPrompt = ({ onSubmit }: NameEntryPromptProp) => {
  const [name, setName] = useState<string>("");

  // A real <form> means Enter on the keyboard submits, same as tapping Continue.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed === "") return;
    onSubmit(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs rounded-card bg-card p-6 text-center"
      >
        <h2 className="text-lg">What should we call you?</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This is how friends will see you in a split.
        </p>

        <input
          value={name}
          type="text"
          aria-label="Your name"
          placeholder="Your name"
          autoFocus
          enterKeyHint="done"
          autoComplete="given-name"
          onChange={(e) => setName(e.target.value)}
          className="mt-5 w-full rounded-control border border-border bg-background px-4 py-3 text-center text-base text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={name.trim() === ""}
          className="mt-4 w-full rounded-control bg-primary py-3 text-base font-semibold text-primary-foreground disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default NameEntryPrompt;
