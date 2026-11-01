import { createContext, useContext } from "react";

export const InstagramContext = createContext(null);

export function useInstagram() {
  const ctx = useContext(InstagramContext);
  if (!ctx) {
    throw new Error("useInstagram must be used inside <InstagramProvider>");
  }
  return ctx;
}