import { createContext } from "react";

export type FlowState = {
  isLoggedIn: boolean;
  userName: string;
  musicProvider: string | null;
  headset: string | null;
};

export type FlowContextType = {
  state: FlowState;
  login: (email: string) => void;
  setMusicProvider: (provider: string) => void;
  setHeadset: (headset: string) => void;
  resetFlow: () => void;
};

export const FlowContext = createContext<FlowContextType | undefined>(undefined);