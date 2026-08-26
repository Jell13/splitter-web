import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NameEntryPrompt from "./NameEntryPrompt";

describe("NameEntryPrompt", () => {
  it("renders the input and button", () => {
    render(<NameEntryPrompt onSubmit={vi.fn()} />);

    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
  });

  it("does not call onSubmit when the name is empty", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<NameEntryPrompt onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not call onSubmit when the name is only whitespace", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<NameEntryPrompt onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Your name"), "   ");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with the entered name", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<NameEntryPrompt onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Your name"), "Jason");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(onSubmit).toHaveBeenCalledWith("Jason");
  });

  it("updates the input as the user types", async () => {
    const user = userEvent.setup();
    render(<NameEntryPrompt onSubmit={vi.fn()} />);

    const input = screen.getByPlaceholderText("Your name") as HTMLInputElement;
    await user.type(input, "Alex");

    expect(input.value).toBe("Alex");
  });
});