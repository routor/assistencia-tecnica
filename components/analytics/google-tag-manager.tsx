/**
 * Google Tag Manager helpers (FR-034, NFR-007, NFR-011, R-008).
 *
 * Basic Consent Mode: the live container script is injected by `lib/consent/consent-mode.ts`
 * only after an applicable optional category is granted. This module keeps the legacy nonce'd
 * bootstrap for tests/docs parity and the noscript iframe for returning visitors who already
 * granted (rendered from the root layout when the consent cookie allows it).
 *
 * GTM failure/blocking cannot affect form behavior — analytics stays decoupled from persistence.
 */
export function GoogleTagManager({ gtmId, nonce }: { gtmId: string; nonce?: string }) {
  const bootstrap = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
  return (
    <script nonce={nonce} dangerouslySetInnerHTML={{ __html: bootstrap }} />
  );
}

export function GoogleTagManagerNoscript({ gtmId }: { gtmId: string }) {
  return (
    <noscript>
      <iframe
        title="gtm"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
