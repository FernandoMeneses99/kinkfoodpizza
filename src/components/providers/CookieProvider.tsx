"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CookieContextType {
  cookiesAccepted: boolean | null;
  acceptCookies: () => void;
  declineCookies: () => void;
  hasInteracted: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const COOKIE_CONSENT_KEY = "krokori_cookie_consent";

export function CookieProvider({ children }: { children: ReactNode }) {
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored !== null) {
      setCookiesAccepted(stored === "accepted");
      setHasInteracted(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setCookiesAccepted(true);
    setHasInteracted(true);
  };

  const declineCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setCookiesAccepted(false);
    setHasInteracted(true);
  };

  return (
    <CookieContext.Provider value={{ cookiesAccepted, acceptCookies, declineCookies, hasInteracted }}>
      {children}
    </CookieContext.Provider>
  );
}

export function useCookies() {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error("useCookies must be used within a CookieProvider");
  }
  return context;
}
