"use client";

import { createContext, useContext, useState, ReactNode,  } from "react";

interface NameWriteContextType {
  hasPlayed: boolean;
  setHasPlayed: (played: boolean) => void;
}
const NameWriteContext = createContext<NameWriteContextType | undefined>(
  undefined
);

export function NameWriteProvider({ children }: { children: ReactNode }) {
  const [hasPlayed, setHasPlayed] = useState(false);

  return (
    <NameWriteContext.Provider value={{ hasPlayed, setHasPlayed }}>
      {children}
    </NameWriteContext.Provider>
  );
}

export function useNameWrite() {
  const context = useContext(NameWriteContext);
  if (context === undefined) {
    throw new Error("useNameWrite must be used within a NameWriteProvider");
  }
  return context;
}
