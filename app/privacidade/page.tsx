import type { Metadata } from "next";
import { connection } from "next/server";
import { CookiePreferencesTrigger } from "@/components/consent/cookie-preferences-trigger";
import { PRIVACY_NOTICE_VERSION } from "@/lib/constants";
import { getPrivacyPolicyConfig } from "@/lib/env";
import { siteRobots } from "@/lib/seo/site-robots";

export function generateMetadata(): Metadata {
  return {
    title: "Privacidade e uso de dados — projeto em validação",
    description:
      "Como usamos os dados do cadastro de interesse: finalidade, categorias, consentimento, limites de análise, retenção e como pedir a remoção.",
    robots: siteRobots(),
  };
}

const dataCategories = [
  ["Identificação e contato", "Nome, nome do negócio, WhatsApp e, se você informar, e-mail."],
  ["Perfil do negócio", "Segmento, tamanho da equipe, volume mensal, processo atual e prioridades."],
  ["Consentimento", "Registro de que você autorizou o uso e da versão desta política aceita."],
  ["Atribuição de campanha", "Parâmetros de UTM e identificador de clique, sem dados pessoais."],
];

export type PrivacyConfig = ReturnType<typeof getPrivacyPolicyConfig>;

export default async function PrivacidadePage() {
  await connection();
  return <PrivacyContent config={getPrivacyPolicyConfig()} />;
}

/** Synchronous content (unit-testable); the route wraps it after `await connection()`. */
export function PrivacyContent({ config }: { config: PrivacyConfig }) {
  const { configured, controllerName, contact, retentionDays } = config;

  return (
    <main id="conteudo" className="py-[var(--spacing-section)]">
      <div className="content-wrap max-w-[760px]">
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-[650] leading-tight">
          Privacidade e uso de dados
        </h1>
        <p className="mt-4 text-sm text-ink-muted">
          Projeto em validação · versão da política: {PRIVACY_NOTICE_VERSION}
        </p>

        {!configured ? (
          <div
            role="note"
            className="mt-6 rounded-md border border-danger bg-danger/10 p-4 text-sm text-ink"
          >
            <strong>Conteúdo de exemplo — não válido para produção.</strong> Os dados oficiais do
            controlador, o canal de contato e o prazo de retenção ainda não foram configurados. Esta
            página só pode ir ao ar quando esses valores forem definidos pelo responsável.
          </div>
        ) : null}

        <section aria-labelledby="finalidade" className="mt-10">
          <h2 id="finalidade" className="text-2xl font-semibold text-ink">
            Para que usamos seus dados
          </h2>
          <p className="mt-3 text-ink-2">
            Este é um projeto em validação. Usamos os dados do cadastro apenas para pesquisa sobre a
            demanda, para eventual contato sobre uma entrevista e para convidar, no futuro, para um
            piloto. Não vendemos esses dados. Não coletamos dados dos aparelhos ou dos clientes da
            sua assistência. Medição de analytics/anúncios, quando autorizada nas preferências de
            cookies, é tratada na seção de cookies abaixo e permanece sem dados pessoais do
            formulário.
          </p>
        </section>

        <section aria-labelledby="categorias" className="mt-8">
          <h2 id="categorias" className="text-2xl font-semibold text-ink">
            Quais dados coletamos
          </h2>
          <dl className="mt-3 space-y-3">
            {dataCategories.map(([term, desc]) => (
              <div key={term}>
                <dt className="font-semibold text-ink">{term}</dt>
                <dd className="text-ink-2">{desc}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-ink-2">
            Não pedimos senhas, padrões de desbloqueio ou credenciais de aparelhos. Não guardamos o
            seu endereço IP como dado do cadastro.
          </p>
        </section>

        <section aria-labelledby="consentimento" className="mt-8">
          <h2 id="consentimento" className="text-2xl font-semibold text-ink">
            Consentimento
          </h2>
          <p className="mt-3 text-ink-2">
            O uso dos dados do cadastro depende do seu aceite explícito no formulário, que nunca vem
            marcado por padrão. Aceitar uma conversa é opcional e separado do consentimento para
            guardar o cadastro. Esse aceite do formulário não autoriza cookies de analytics ou
            publicidade — essas escolhas são feitas no banner ou em Preferências de cookies.
          </p>
        </section>

        <section aria-labelledby="cookies" className="mt-8">
          <h2 id="cookies" className="text-2xl font-semibold text-ink">
            Cookies e tecnologias semelhantes
          </h2>
          <p className="mt-3 text-ink-2">
            Usamos um controle próprio de preferências (sem CMP de terceiros). As categorias são:
          </p>
          <dl className="mt-3 space-y-3">
            <div>
              <dt className="font-semibold text-ink">Necessários</dt>
              <dd className="text-ink-2">
                Precisos para o site funcionar com segurança e para lembrar a sua escolha de cookies.
                Ficam sempre ativos. O registro da escolha fica em um cookie first-party
                (`consertify_consent`), com versão da política de cookies, as opções de Analytics e
                Publicidade, e um carimbo técnico de atualização — sem nome, e-mail, telefone ou
                respostas do formulário.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Analytics (opcional)</dt>
              <dd className="text-ink-2">
                Se você autorizar, podemos medir o funil de forma agregada (por exemplo com Google
                Analytics 4 via Google Tag Manager), ainda sem enviar dados pessoais do cadastro.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Publicidade (opcional)</dt>
              <dd className="text-ink-2">
                Se você autorizar, podemos medir conversões de anúncios com tecnologias Google
                (Tag Manager / Google Ads). Não vendemos os seus dados e não usamos o cadastro para
                publicidade de terceiros fora desse contexto de medição autorizado.
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-ink-2">
            Antes da sua escolha, e se você rejeitar as categorias opcionais, o Google Tag Manager
            não é carregado. Você pode alterar ou revogar a escolha a qualquer momento em
            Preferências de cookies (no rodapé) ou reabrindo o painel. Se a versão da política de
            cookies mudar, pedimos uma nova escolha. A validade técnica do cookie de preferência é
            de 180 dias.
          </p>
          <p className="mt-3 text-ink-2">
            Revogar uma categoria atualiza o Consent Mode e impede novos disparos daquela categoria.
            Tags ou cookies já carregados pelo Google podem ter limitações técnicas de remoção
            imediata; não prometemos apagar retroativamente dados já enviados antes da revogação.
          </p>
          <p className="mt-3">
            <CookiePreferencesTrigger className="text-ink-2 underline underline-offset-4 hover:text-ink" />
          </p>
        </section>

        <section aria-labelledby="analise" className="mt-8">
          <h2 id="analise" className="text-2xl font-semibold text-ink">
            Limites da análise (analytics)
          </h2>
          <p className="mt-3 text-ink-2">
            Medimos o funil de forma agregada e sem dados pessoais do formulário. Nunca enviamos
            nome, WhatsApp, e-mail, nome do negócio ou suas respostas para ferramentas de análise ou
            de anúncios. Analytics e publicidade só entram em operação depois da sua autorização
            explícita nas preferências de cookies; rejeitar cookies opcionais não impede o envio do
            cadastro de interesse.
          </p>
        </section>

        <section aria-labelledby="retencao" className="mt-8">
          <h2 id="retencao" className="text-2xl font-semibold text-ink">
            Por quanto tempo guardamos
          </h2>
          <p className="mt-3 text-ink-2">
            {retentionDays
              ? `Guardamos o cadastro por até ${retentionDays} dias, ou até você pedir a remoção.`
              : "O prazo de retenção ainda será definido pelo responsável antes da publicação. Até lá, esta informação não é válida para produção."}
          </p>
        </section>

        <section aria-labelledby="direitos" className="mt-8">
          <h2 id="direitos" className="text-2xl font-semibold text-ink">
            Seus direitos e como pedir a remoção
          </h2>
          <p className="mt-3 text-ink-2">
            Você pode pedir acesso, correção ou remoção do seu cadastro. Para isso, use o canal
            oficial abaixo. Localizamos o registro pelo seu contato normalizado e removemos apenas o
            seu cadastro.
          </p>
          <ul className="mt-4 space-y-2 text-ink-2">
            <li>
              <span className="font-semibold text-ink">Controlador: </span>
              {controllerName ?? "a definir (não configurado)"}
            </li>
            <li>
              <span className="font-semibold text-ink">Contato para dados/remoção: </span>
              {contact ?? "a definir (não configurado)"}
            </li>
          </ul>
        </section>

        <div className="mt-10">
          <a
            href="/assistencia-tecnica"
            className="text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Voltar para a página
          </a>
        </div>
      </div>
    </main>
  );
}
