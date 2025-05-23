"use client";

import { useEffect } from "react";

export default function FaviconSwitcher() {
  useEffect(() => {
    const lightFavicon = "logo-light.png";
    const darkFavicon = "logo-dark.png";

    const updateFavicon = (isDark: boolean) => {
      const favicon = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement;

      if (favicon) {
        favicon.href = isDark ? lightFavicon : darkFavicon;
      } else {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = isDark ? lightFavicon : darkFavicon;
        document.head.appendChild(link);
      }
    };

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    updateFavicon(matchMedia.matches); // Set on load

    const listener = (e: MediaQueryListEvent) => updateFavicon(e.matches);
    matchMedia.addEventListener("change", listener);

    return () => matchMedia.removeEventListener("change", listener);
  }, []);

  return null;
}
