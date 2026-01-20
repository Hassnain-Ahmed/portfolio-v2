import { useEffect } from "react";

/**
 * UnicornBackground — animated ASCII canvas via UnicornStudio.
 * Use as an absolute-positioned background layer.
 */
export function UnicornBackground() {
  useEffect(() => {
    const embedScript = document.createElement("script");
    embedScript.type = "text/javascript";
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement("style");
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      /* Kill the badge injected into <body> outside the project container */
      a[href*="unicorn.studio"],
      a[href*="unicornstudio"],
      [class*="us-badge"],
      [class*="unicorn-badge"],
      [id*="unicorn-badge"],
      [data-us-badge] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    const HIDE_CSS =
      "display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:fixed!important;left:-9999px!important;top:-9999px!important;";

    const killNode = (el: Element) => {
      (el as HTMLElement).style.cssText = HIDE_CSS;
      try { el.remove(); } catch (_) {}
    };

    const isBadge = (el: Element): boolean => {
      const html = (el as HTMLElement).outerHTML?.toLowerCase() ?? "";
      const href = (el.getAttribute("href") ?? "").toLowerCase();
      return (
        href.includes("unicorn.studio") ||
        href.includes("unicornstudio") ||
        html.includes("unicorn.studio") ||
        html.includes("made with unicorn")
      );
    };

    const hideBranding = () => {
      document.querySelectorAll("body > *").forEach((el) => {
        if (isBadge(el)) killNode(el);
      });
      document.querySelectorAll("a[href]").forEach((el) => {
        if (isBadge(el)) {
          const parent = el.parentElement;
          if (parent && parent !== document.body) killNode(parent);
          killNode(el);
        }
      });
    };

    // MutationObserver — fires the instant the badge node is injected
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const el = node as Element;
            if (isBadge(el)) killNode(el);
            el.querySelectorAll?.("a[href]").forEach((a) => {
              if (isBadge(a)) killNode(el); // remove the whole injected container
            });
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    hideBranding();
    const interval = setInterval(hideBranding, 200);
    [300, 800, 1500, 3000].forEach((t) => setTimeout(hideBranding, t));

    return () => {
      clearInterval(interval);
      observer.disconnect();
      if (document.head.contains(embedScript))
        document.head.removeChild(embedScript);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      data-us-project="OMzqyUv6M3kSnv0JeAtC"
      style={{ width: "100%", height: "100%", minHeight: "100vh" }}
    />
  );
}

/** Full hero page (default export for standalone use) */
export default function HeroAsciiOne() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 w-full h-full">
        <UnicornBackground />
      </div>
    </main>
  );
}
