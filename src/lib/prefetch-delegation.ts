/**
 * Global Prefetch Event Delegation
 * Monitors hover (mouseover/mouseout) and touch (touchstart) events on the body.
 * If a user hovers over a link with a [data-prefetch] attribute for 250ms,
 * dynamically injects a <link rel="prefetch" href="..."> element to prefetch it.
 * Guarded against Safari's lack of navigator.connection and data-saving settings.
 */

if (typeof window !== 'undefined') {
  const prefetchedUrls = new Set<string>();
  let prefetchTimeout: number | undefined;
  let activeElement: HTMLAnchorElement | null = null;

  const getPrefetchLink = (target: EventTarget | null): HTMLAnchorElement | null => {
    let el = target as HTMLElement | null;
    while (el && el !== document.body) {
      if (el.tagName === 'A' && el.hasAttribute('data-prefetch')) {
        return el as HTMLAnchorElement;
      }
      el = el.parentElement;
    }
    return null;
  };

  const prefetch = (url: string) => {
    if (!url || prefetchedUrls.has(url)) return;
    
    // Check connection properties for data-saving mode or slow connection
    const conn = (navigator as any).connection;
    if (conn) {
      if (conn.saveData === true) return;
      if (['2g', '3g'].includes(conn.effectiveType)) return;
    }

    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      prefetchedUrls.add(url);
    } catch (e) {
      // Gracefully ignore prefetch insertion failures
    }
  };

  const handleMouseOver = (e: MouseEvent) => {
    const link = getPrefetchLink(e.target);
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    if (activeElement === link) return;
    activeElement = link;

    if (prefetchTimeout) {
      clearTimeout(prefetchTimeout);
    }

    prefetchTimeout = window.setTimeout(() => {
      if (activeElement === link) {
        prefetch(href);
      }
    }, 250);
  };

  const handleMouseOut = (e: MouseEvent) => {
    const link = getPrefetchLink(e.target);
    if (!link) return;

    // Check if the cursor is actually leaving the active link element
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    if (activeElement && (!relatedTarget || !activeElement.contains(relatedTarget))) {
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
        prefetchTimeout = undefined;
      }
      activeElement = null;
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const link = getPrefetchLink(e.target);
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    prefetch(href);
  };

  document.body.addEventListener('mouseover', handleMouseOver);
  document.body.addEventListener('mouseout', handleMouseOut);
  document.body.addEventListener('touchstart', handleTouchStart, { passive: true });
}
