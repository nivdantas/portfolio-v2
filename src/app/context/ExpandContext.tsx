"use client";

import { createContext, useContext, useState, ReactNode} from "react";

interface CardStates {
  [cardId: string]: boolean;
}
interface ExpandContextType {
  cardStates: CardStates;
  setCardExpanded: (cardId: string, isExpanded: boolean) => void;
  isCardExpanded: (cardId: string) => boolean;
}

const ExpandContext = createContext<ExpandContextType | undefined>(undefined);

export function ExpandProvider({ children }: { children: ReactNode }) {
  const [cardStates, setCardStates] = useState<CardStates>({});
  const setCardExpanded = (cardId: string, isExpanded: boolean) => {
    setCardStates((prevStates) => ({
      ...prevStates,
      [cardId]: isExpanded,
    }));
  };
  const isCardExpanded = (cardId: string) => {
    return cardStates[cardId] || false;
  };
  return (
    <ExpandContext.Provider
      value={{ cardStates, setCardExpanded, isCardExpanded }}
    >
      {children}
    </ExpandContext.Provider>
  );
}

export function useExpand() {
  const context = useContext(ExpandContext);
  if (context === undefined) {
    throw new Error("useExpand must be used within an ExpandProvider");
  }
  return context;
}
