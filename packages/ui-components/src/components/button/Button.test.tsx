import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  // ─── Rendering ───────────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders children", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("has data-slot=button attribute", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
    });

    it("defaults to type=button", () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("sets type=submit", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    it("sets type=reset", () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });

    it("merges custom className", () => {
      render(<Button className="custom-class">Click</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("forwards ref to the button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  // ─── Variants ────────────────────────────────────────────────────────────────

  describe("variants", () => {
    it("applies primary variant by default", () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-sgx-blue");
    });

    it("applies danger variant", () => {
      render(<Button variant="danger">Danger</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-destructive");
    });

    it("applies success variant", () => {
      render(<Button variant="success">Success</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-sgx-green");
    });

    it("applies ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-transparent");
    });

    it("applies outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-sgx-light-blue");
    });

    it("uses color prop as fallback when variant is not set", () => {
      render(<Button color="danger">Color</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-destructive");
    });

    it("prefers variant over color when both provided", () => {
      render(<Button variant="success" color="danger">Both</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-sgx-green");
      expect(screen.getByRole("button")).not.toHaveClass("bg-destructive");
    });
  });

  // ─── Sizes ───────────────────────────────────────────────────────────────────

  describe("sizes", () => {
    it("applies md size by default", () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-9");
    });

    it("applies sm size", () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-8");
    });

    it("applies lg size", () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-10");
    });
  });

  // ─── Radius ──────────────────────────────────────────────────────────────────

  describe("radius", () => {
    it("applies lg radius by default", () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole("button")).toHaveClass("rounded-lg");
    });

    it("applies full radius", () => {
      render(<Button radius="full">Full</Button>);
      expect(screen.getByRole("button")).toHaveClass("rounded-full");
    });

    it("applies sm radius", () => {
      render(<Button radius="sm">Sm</Button>);
      expect(screen.getByRole("button")).toHaveClass("rounded-sm");
    });
  });

  // ─── Loading State ───────────────────────────────────────────────────────────

  describe("loading state", () => {
    it("renders a spinner svg when isLoading=true", () => {
      const { container } = render(<Button isLoading>Loading</Button>);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("sets aria-busy=true when loading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("does not set aria-busy when not loading", () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
    });

    it("adds opacity-80 and cursor-wait when loading", () => {
      render(<Button isLoading>Loading</Button>);
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("opacity-80");
      expect(btn).toHaveClass("cursor-wait");
    });

    it("places spinner before children by default", () => {
      const { container } = render(<Button isLoading>Text</Button>);
      const nodes = Array.from(container.querySelector("button")!.childNodes);
      expect(nodes[0].nodeName).toBe("svg");
    });

    it("places spinner after children when spinnerPlacement=end", () => {
      const { container } = render(
        <Button isLoading spinnerPlacement="end">Text</Button>
      );
      const nodes = Array.from(container.querySelector("button")!.childNodes);
      expect(nodes[nodes.length - 1].nodeName).toBe("svg");
    });

    it("hides startContent while loading", () => {
      render(
        <Button isLoading startContent={<span data-testid="icon">S</span>}>
          Click
        </Button>
      );
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });

    it("hides endContent while loading", () => {
      render(
        <Button isLoading endContent={<span data-testid="icon">E</span>}>
          Click
        </Button>
      );
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });
  });

  // ─── Disabled State ──────────────────────────────────────────────────────────

  describe("disabled state", () => {
    it("is disabled when disabled=true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("is not disabled by default", () => {
      render(<Button>Active</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });

    it("disables when disableOnLoading=true and isLoading=true", () => {
      render(<Button disableOnLoading isLoading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("stays enabled when isLoading without disableOnLoading", () => {
      render(<Button isLoading>Loading</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  // ─── Full Width ───────────────────────────────────────────────────────────────

  describe("fullWidth", () => {
    it("adds w-full class when fullWidth=true", () => {
      render(<Button fullWidth>Full</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });

    it("does not add w-full by default", () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole("button")).not.toHaveClass("w-full");
    });
  });

  // ─── Content Slots ───────────────────────────────────────────────────────────

  describe("content slots", () => {
    it("renders startContent when not loading", () => {
      render(
        <Button startContent={<span data-testid="start">S</span>}>Click</Button>
      );
      expect(screen.getByTestId("start")).toBeInTheDocument();
    });

    it("renders endContent when not loading", () => {
      render(
        <Button endContent={<span data-testid="end">E</span>}>Click</Button>
      );
      expect(screen.getByTestId("end")).toBeInTheDocument();
    });
  });

  // ─── Interaction ─────────────────────────────────────────────────────────────

  describe("interaction", () => {
    it("calls onClick when clicked", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click</Button>);
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button disabled onClick={onClick}>Disabled</Button>);
      await user.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
