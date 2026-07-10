/**
 * Non-blocking, nonce-aware Google Tag Manager loader (FR-034, NFR-007, NFR-011, R-008).
 *
 * The inline bootstrap carries the per-request nonce (allowed by `script-src 'nonce-…'`); it
 * injects `gtm.js` asynchronously, and `'strict-dynamic'` propagates trust to GTM/GA/Ads scripts
 * without host wildcards. GTM failure/blocking cannot affect form behavior — analytics is fully
 * decoupled from persistence. Rendered ONLY when a container id is configured.
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
