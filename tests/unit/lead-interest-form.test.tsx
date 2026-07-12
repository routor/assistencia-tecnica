// @vitest-environment jsdom
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PII_NEEDLES } from "@/tests/fixtures/lead";

// Control the Server Action so the component test never touches a database.
const submitLeadMock = vi.fn();
vi.mock("@/lib/actions/submit-lead", () => ({
  submitLead: (prev: unknown, formData: FormData) => submitLeadMock(prev, formData),
}));

const pushAnalyticsMock = vi.fn();
vi.mock("@/lib/analytics/events", () => ({
  pushAnalyticsEvent: (...args: unknown[]) => pushAnalyticsMock(...args),
}));

import { LeadInterestForm } from "@/components/forms/lead-interest-form";

afterEach(() => {
  submitLeadMock.mockReset();
  pushAnalyticsMock.mockReset();
  // Ensure no PII leaked into storage APIs during the form session.
  expect(window.localStorage.length).toBe(0);
  expect(window.sessionStorage.length).toBe(0);
});

async function fillStep1(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/seu nome/i), "Fulano de Teste");
  await user.type(screen.getByLabelText(/nome do negócio/i), "Bancada Sintética");
  await user.type(screen.getByLabelText(/whatsapp/i), "11988887777");
  await user.type(screen.getByLabelText(/^e-mail/i), "ana@example.com");
  await user.selectOptions(screen.getByLabelText(/o que você mais conserta/i), "celulares_tablets");
}

async function fillStep2(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(screen.getByLabelText(/tamanho da equipe/i), "2_3");
  await user.selectOptions(screen.getByLabelText(/aparelhos que entram por mês/i), "31_100");
  await user.selectOptions(screen.getByLabelText(/como você organiza hoje/i), "planilha");
  await user.selectOptions(screen.getByLabelText(/onde mais trava hoje/i), "status_cliente");
  const group = screen.getByRole("group", { name: /o que resolveria mais/i });
  const boxes = within(group).getAllByRole("checkbox");
  await user.click(boxes[0]!);
  await user.click(boxes[1]!);
  await user.selectOptions(screen.getByLabelText(/cadê meu conserto/i), "diariamente");
  await user.selectOptions(screen.getByLabelText(/quanto pagaria por mês/i), "130_199");
}

function echoedValues(overrides: Record<string, string | string[]> = {}) {
  return {
    name: "Fulano de Teste",
    business_name: "Bancada Sintética",
    whatsapp: "11988887777",
    email: "ana@example.com",
    segment: "celulares_tablets",
    team_size: "2_3",
    monthly_intakes: "31_100",
    current_process: "planilha",
    main_bottleneck: "status_cliente",
    priority_features: ["ficha_aparelho", "fotos"],
    customer_status_frequency: "diariamente",
    price_range: "130_199",
    ...overrides,
  };
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

  it("submits every step-1 and step-2 value including segment", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue({ status: "success" });
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await fillStep2(user);
    await user.click(screen.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }));
    await user.click(screen.getByRole("button", { name: /enviar e participar/i }));

    await waitFor(() => expect(submitLeadMock).toHaveBeenCalledTimes(1));
    const fd = submitLeadMock.mock.calls[0]![1] as FormData;
    expect(fd.get("name")).toBe("Fulano de Teste");
    expect(fd.get("segment")).toBe("celulares_tablets");
    expect(fd.get("team_size")).toBe("2_3");
    expect(fd.get("privacy_consent")).toBe("on");
    expect(fd.getAll("priority_features")).toEqual(["ficha_aparelho", "fotos"]);
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
    expect(screen.getByLabelText(/o que você mais conserta/i)).toHaveValue("celulares_tablets");
  });

  it("preserves all fields, stays on step 2, focuses consent, and skips success on step-2 invalid", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue({
      status: "invalid",
      message: "Confira os campos destacados.",
      fieldErrors: {
        privacy_consent: "É necessário aceitar o uso dos dados para participar.",
      },
      values: echoedValues(),
    });

    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await fillStep2(user);
    // Submit without consent.
    await user.click(screen.getByRole("button", { name: /enviar e participar/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/é necessário aceitar/i),
    );
    expect(screen.getByText(/etapa 2 de 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seu nome/i)).toHaveValue("Fulano de Teste");
    expect(screen.getByLabelText(/o que você mais conserta/i)).toHaveValue("celulares_tablets");
    expect(screen.getByLabelText(/tamanho da equipe/i)).toHaveValue("2_3");
    expect(screen.getByLabelText(/aparelhos que entram por mês/i)).toHaveValue("31_100");
    expect(screen.getByLabelText(/como você organiza hoje/i)).toHaveValue("planilha");
    expect(screen.getByLabelText(/onde mais trava hoje/i)).toHaveValue("status_cliente");
    expect(screen.getByLabelText(/cadê meu conserto/i)).toHaveValue("diariamente");
    expect(screen.getByLabelText(/quanto pagaria por mês/i)).toHaveValue("130_199");
    expect(screen.getByLabelText(/^e-mail/i)).toHaveValue("ana@example.com");

    const group = screen.getByRole("group", { name: /o que resolveria mais/i });
    expect(within(group).getByRole("checkbox", { name: /ficha do aparelho/i })).toBeChecked();
    expect(within(group).getByRole("checkbox", { name: /fotos na entrada/i })).toBeChecked();

    const consent = screen.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i });
    expect(consent).toHaveAttribute("aria-invalid", "true");
    await waitFor(() => expect(consent).toHaveFocus());
    expect(
      screen.getAllByText(/é necessário aceitar o uso dos dados para participar/i).length,
    ).toBeGreaterThanOrEqual(2);
    expect(pushAnalyticsMock).toHaveBeenCalledWith("lead_form_validation_error", {
      form_step: 2,
    });
    expect(pushAnalyticsMock).not.toHaveBeenCalledWith("lead_submit_success");
  });

  it("returns to step 1, preserves step-2 values, and focuses segment on step-1 invalid", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue({
      status: "invalid",
      message: "Confira os campos destacados.",
      fieldErrors: { segment: "Selecione o segmento principal." },
      values: echoedValues({ segment: "" }),
    });

    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await fillStep2(user);
    await user.click(screen.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }));
    await user.click(screen.getByRole("button", { name: /enviar e participar/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/selecione o segmento principal/i),
    );
    expect(screen.getByText(/etapa 1 de 2/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seu nome/i)).toHaveValue("Fulano de Teste");
    expect(screen.getByLabelText(/tamanho da equipe/i)).toHaveValue("2_3");
    const segment = screen.getByLabelText(/o que você mais conserta/i);
    expect(segment).toHaveAttribute("aria-invalid", "true");
    await waitFor(() => expect(segment).toHaveFocus());
    expect(pushAnalyticsMock).toHaveBeenCalledWith("lead_form_validation_error", {
      form_step: 1,
    });
    expect(pushAnalyticsMock).not.toHaveBeenCalledWith("lead_submit_success");
  });

  it("emits lead_submit_success exactly once on success", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue({ status: "success" });
    render(<LeadInterestForm />);
    await fillStep1(user);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await fillStep2(user);
    await user.click(screen.getByRole("checkbox", { name: /autorizo o uso dos meus dados/i }));
    await user.click(screen.getByRole("button", { name: /enviar e participar/i }));

    await waitFor(() =>
      expect(pushAnalyticsMock).toHaveBeenCalledWith("lead_submit_success"),
    );
    expect(
      pushAnalyticsMock.mock.calls.filter((c) => c[0] === "lead_submit_success"),
    ).toHaveLength(1);
    // Analytics payloads must not include PII needles.
    for (const call of pushAnalyticsMock.mock.calls) {
      const serialized = JSON.stringify(call);
      for (const needle of PII_NEEDLES) {
        expect(serialized).not.toContain(needle);
      }
    }
  });
});
