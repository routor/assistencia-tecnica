// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PrivacyContent, type PrivacyConfig } from "@/app/privacidade/page";

const configured: PrivacyConfig = {
  configured: true,
  controllerName: "Controlador Exemplo Ltda",
  contact: "privacidade@exemplo.com",
  retentionDays: 180,
};
const unconfigured: PrivacyConfig = { configured: false };

describe("privacy page content (FR-035, NFR-010)", () => {
  it("explains purpose, categories, consent, analytics boundary, retention, and rights", () => {
    render(<PrivacyContent config={configured} />);
    expect(screen.getByRole("heading", { name: /para que usamos seus dados/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /quais dados coletamos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /consentimento/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /limites da análise/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /por quanto tempo/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seus direitos e como pedir a remoção/i })).toBeInTheDocument();
  });

  it("shows the configured controller, contact, and retention", () => {
    render(<PrivacyContent config={configured} />);
    expect(screen.getByText(/Controlador Exemplo Ltda/)).toBeInTheDocument();
    expect(screen.getByText(/privacidade@exemplo\.com/)).toBeInTheDocument();
    expect(screen.getByText(/180 dias/)).toBeInTheDocument();
  });

  it("states data is NOT sent to analytics and device credentials are not collected", () => {
    render(<PrivacyContent config={configured} />);
    const body = document.body.textContent ?? "";
    expect(body).toMatch(/nunca enviamos.*(análise|anúncios)/i);
    expect(body).toMatch(/não pedimos senhas/i);
    expect(body).toMatch(/não guardamos o seu endereço ip/i);
  });

  it("fails closed for production when controller/contact/retention are not configured", () => {
    render(<PrivacyContent config={unconfigured} />);
    expect(screen.getByText(/não válido para produção/i)).toBeInTheDocument();
    expect(screen.getAllByText(/a definir \(não configurado\)/i).length).toBeGreaterThanOrEqual(2);
  });
});
