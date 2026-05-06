import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  // ─── Rendering ───────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders an input element", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("has data-slot=input attribute", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
    });

    it("defaults to type=text via DOM property", () => {
      render(<Input />);
      expect((screen.getByRole("textbox") as HTMLInputElement).type).toBe("text");
    });

    it("renders type=email", () => {
      render(<Input type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders type=password", () => {
      const { container } = render(<Input type="password" />);
      expect(container.querySelector('input[type="password"]')).toBeInTheDocument();
    });

    it("renders type=number as spinbutton", () => {
      render(<Input type="number" />);
      expect(screen.getByRole("spinbutton")).toBeInTheDocument();
    });

    it("renders placeholder text", () => {
      render(<Input placeholder="Enter value..." />);
      expect(screen.getByPlaceholderText("Enter value...")).toBeInTheDocument();
    });

    it("merges custom className", () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole("textbox")).toHaveClass("custom-class");
    });

    it("passes through additional html attributes", () => {
      render(<Input id="field" name="field" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "field");
      expect(input).toHaveAttribute("name", "field");
    });

    it("forwards ref to the underlying input element", () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  // ─── Variants ────────────────────────────────────────────────────────────────

  describe("variants", () => {
    it("applies default variant by default", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveClass("bg-input-background");
    });

    it("applies ghost variant", () => {
      render(<Input variant="ghost" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-transparent");
      expect(input).toHaveClass("bg-transparent");
    });

    it("applies outlined variant", () => {
      render(<Input variant="outlined" />);
      expect(screen.getByRole("textbox")).toHaveClass("border-sgx-blue");
    });
  });

  // ─── Sizes ───────────────────────────────────────────────────────────────────

  describe("sizes", () => {
    it("applies md size by default", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveClass("h-9");
    });

    it("applies sm size", () => {
      render(<Input size="sm" />);
      expect(screen.getByRole("textbox")).toHaveClass("h-7");
    });

    it("applies lg size", () => {
      render(<Input size="lg" />);
      expect(screen.getByRole("textbox")).toHaveClass("h-11");
    });
  });

  // ─── Disabled State ──────────────────────────────────────────────────────────

  describe("disabled state", () => {
    it("is disabled when disabled=true", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toBeDisabled();
    });

    it("is not disabled by default", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).not.toBeDisabled();
    });

    it("applies disabled Tailwind classes", () => {
      render(<Input disabled />);
      expect(screen.getByRole("textbox")).toHaveClass("disabled:opacity-50");
    });
  });

  // ─── Value and onChange ───────────────────────────────────────────────────────

  describe("value and onChange", () => {
    it("renders a controlled value", () => {
      render(<Input value="hello" onChange={() => {}} />);
      expect(screen.getByRole("textbox")).toHaveValue("hello");
    });

    it("renders with defaultValue", () => {
      render(<Input defaultValue="default" />);
      expect(screen.getByRole("textbox")).toHaveValue("default");
    });

    it("calls onChange on each keystroke", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Input onChange={onChange} />);
      await user.type(screen.getByRole("textbox"), "abc");
      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it("reflects typed text in uncontrolled mode", async () => {
      const user = userEvent.setup();
      render(<Input />);
      await user.type(screen.getByRole("textbox"), "hello");
      expect(screen.getByRole("textbox")).toHaveValue("hello");
    });

    it("clears value when user clears the input", async () => {
      const user = userEvent.setup();
      render(<Input defaultValue="initial" />);
      await user.clear(screen.getByRole("textbox"));
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });

  // ─── Aria Attributes ─────────────────────────────────────────────────────────

  describe("aria attributes", () => {
    it("accepts aria-label", () => {
      render(<Input aria-label="Search field" />);
      expect(screen.getByRole("textbox", { name: "Search field" })).toBeInTheDocument();
    });

    it("passes aria-invalid attribute", () => {
      render(<Input aria-invalid="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    });

    it("includes aria-invalid Tailwind class for conditional styling", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toHaveClass("aria-invalid:border-destructive");
    });

    it("accepts aria-required", () => {
      render(<Input aria-required="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });

    it("accepts aria-describedby", () => {
      render(<Input aria-describedby="helper" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "helper");
    });
  });
});
