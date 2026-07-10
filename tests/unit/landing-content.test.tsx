// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LandingContent } from "@/components/marketing/landing-content";

// The route wraps LandingContent after `await connection()` (dynamic rendering for the CSP nonce);
// the content itself is synchronous and unit-testable.
const renderPage = () => render(<LandingContent />);

describe("US1 landing content — honesty & completeness (FR-001..FR-010, SC-001/2/13)", () => {
  it("states the validation status prominently and repeatedly (FR-002)", () => {
    renderPage();
    const validationMentions = screen.getAllByText(/projeto em validação/i);
    expect(validationMentions.length).toBeGreaterThanOrEqual(2);
  });

  it("shows the primary pilot CTA (FR-003)", () => {
    renderPage();
    expect(
      screen.getAllByRole("link", { name: /participar do piloto|começar o cadastro/i }).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("communicates the intake-to-warranty promise in the hero (FR-002)", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { level: 1, name: /da entrada do aparelho à garantia/i }),
    ).toBeInTheDocument();
  });

  it("renders the eleven content areas as landmarks/sections", () => {
    const { container } = renderPage();
    expect(container.querySelector("header")).toBeInTheDocument();
    expect(container.querySelector("main#conteudo")).toBeInTheDocument();
    expect(container.querySelector("footer")).toBeInTheDocument();
    // Nine labelled sections inside main + the header + footer = the eleven areas.
    const sections = container.querySelectorAll("main section[aria-labelledby], main section[id]");
    expect(sections.length).toBeGreaterThanOrEqual(9);
  });

  it("presents the lifecycle in the correct intake -> warranty order (FR-005)", () => {
    renderPage();
    const list = screen.getByRole("list", { name: /etapas do fluxo proposto/i });
    const items = within(list)
      .getAllByRole("listitem")
      .map((li) => li.textContent ?? "");
    const order = [
      "Entrada",
      "Registro e evidências",
      "Diagnóstico",
      "Orçamento",
      "Aprovação",
      "Reparo e status",
      "Entrega e retirada",
      "Garantia",
    ];
    order.forEach((label, i) => {
      expect(items[i]).toContain(label);
    });
  });

  it("labels the conceptual product view as a concept (FR-006)", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: /visão do produto/i })).toBeInTheDocument();
    expect(screen.getAllByText(/conceito/i).length).toBeGreaterThanOrEqual(1);
  });

  it("serves multiple repair domains without collapsing into field service (FR-007)", () => {
    renderPage();
    const body = document.body.textContent ?? "";
    for (const domain of [
      /celulares/i,
      /computadores|notebooks/i,
      /eletrônicos/i,
      /eletrodomésticos/i,
      /equipamentos comerciais/i,
      /ferramentas/i,
    ]) {
      expect(body).toMatch(domain);
    }
  });

  it("explicitly excludes the non-audience (FR-008)", () => {
    renderPage();
    const body = document.body.textContent ?? "";
    expect(body).toMatch(/serviço de campo/i);
    expect(body).toMatch(/automotiv/i);
    expect(body).toMatch(/redes autorizadas/i);
    expect(body).toMatch(/consumidor/i);
  });

  it("has a semantic FAQ with the six domains (FR-002 scenario 5)", () => {
    const { container } = renderPage();
    const details = container.querySelectorAll("details");
    expect(details.length).toBeGreaterThanOrEqual(6);
    const body = document.body.textContent ?? "";
    expect(body).toMatch(/quanto vai custar/i);
    expect(body).toMatch(/celular/i);
    expect(body).toMatch(/dados/i);
  });

  it("contains NO fabricated proof or availability claims (FR-009, FR-010, SC-013)", () => {
    renderPage();
    const body = (document.body.textContent ?? "").toLowerCase();
    for (const forbidden of [
      "já disponível",
      "disponível agora",
      "compre agora",
      "assine já",
      "clientes satisfeitos",
      "depoimento",
      "avaliação 5 estrelas",
      "estrelas",
      "mais vendido",
    ]) {
      expect(body).not.toContain(forbidden);
    }
  });

  it("links to BOTH the privacy page and a contact/deletion channel in the footer (FR-036)", () => {
    const { container } = renderPage();
    const footer = container.querySelector("footer")!;
    const hrefs = Array.from(footer.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    // Privacy policy link.
    expect(hrefs).toContain("/privacidade");
    // Contact / data-deletion channel link (rights section anchor).
    expect(hrefs).toContain("/privacidade#direitos");
  });
});
