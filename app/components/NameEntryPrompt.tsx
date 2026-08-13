"use client";

import React, { useState } from "react";
import { NameEntryPromptProp } from "../lib/types";

const NameEntryPrompt = ({ onSubmit }: NameEntryPromptProp) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = () => {
    if (name.trim() == "") return
    onSubmit(name)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 px-6">
      <div className="w-full max-w-xs rounded-card bg-card p-6 text-center">
        <h2 className="text-[18px]">What should we call you?</h2>
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          This is how friends will see you in a split.
        </p>

        <input
          value={name}
          type="text"
          placeholder="Your name"
          autoFocus
          onChange={(e) => setName(e.target.value)}
          className="mt-5 w-full rounded-control border border-border bg-background px-4 py-3 text-center text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full rounded-control bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default NameEntryPrompt;
