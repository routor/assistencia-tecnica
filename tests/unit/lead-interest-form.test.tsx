// @vitest-environment jsdom
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

// Control the Server Action so the component test never touches a database.
const submitLeadMock = vi.fn();
vi.mock("@/lib/actions/submit-lead", () => ({
  submitLead: (prev: unknown, formData: FormData) => submitLeadMock(prev, formData),
}));

import { LeadInterestForm } from "@/components/forms/lead-interest-form";

afterEach(() => {
  submitLeadMock.mockReset();
});

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/seu nome/i), "Fulano de Teste");
  await user.type(screen.getByLabelText(/nome do negócio/i), "Bancada Sintética");
  await user.type(screen.getByLabelText(/whatsapp/i), "11988887777");
  await user.selectOptions(screen.getByLabelText(/o que você mais conserta/i), "celulares_tablets");
}

describe("LeadInterestForm (FR-011..FR-025, NFR-001)", () => {
  it("shows step 1 with the 2-minute estimate and progress semantics", () => {
    render(<LeadInterestForm />);
    expect(screen.getByText(/etapa 1 de 2 · cerca de 2 minutos/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /etapa 1 · sobre você e o negócio/i }),
    ).toBeInTheDocument();
  });

  it("blocks advancing with an invalid step 1 and shows accessible field errors", async () => {
    const user = userEvent.setup();
    render(<LeadInterestForm />);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    // Still on step 1; name field is marked invalid.
    expect(screen.getByLabelText(/seu nome/i)).toHaveAttribute("aria-invalid", "true");
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("advances to step 2 after a valid step 1 and moves focus to the step 2 heading", async () => {
    const user = userEvent.setup();
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    const step2Heading = screen.getByRole("heading", { name: /etapa 2 · sua rotina/i });
    expect(step2Heading).toBeVisible();
    await waitFor(() => expect(step2Heading).toHaveFocus());
  });

  it("enforces the 1–5 priority selection bound in the UI", async () => {
    const user = userEvent.setup();
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));

    const group = screen.getByRole("group", { name: /o que resolveria mais/i });
    const boxes = within(group).getAllByRole("checkbox");
    for (let i = 0; i < 5; i++) await user.click(boxes[i]!);
    expect(within(group).getByText(/5 de 5 selecionadas/i)).toBeInTheDocument();
    // The 6th unchecked option is disabled once 5 are chosen.
    expect(boxes[5]).toBeDisabled();
  });

  it("keeps the privacy consent checkbox unchecked by default (never preselected)", async () => {
    const user = userEvent.setup();
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    const consent = screen.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i });
    expect(consent).not.toBeChecked();
  });

  it("exposes a non-focusable honeypot that is not in the tab flow", () => {
    render(<LeadInterestForm />);
    const honeypot = document.querySelector('input[name="company_website"]');
    expect(honeypot).toBeTruthy();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  it("can navigate back from step 2 to step 1 preserving entered values", async () => {
    const user = userEvent.setup();
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /voltar/i }));
    expect(screen.getByLabelText(/seu nome/i)).toHaveValue("Fulano de Teste");
    expect(screen.getByLabelText(/whatsapp/i)).toHaveValue("11988887777");
  });
});
