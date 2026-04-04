import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FlowContext } from "./flowContext";
import type { FlowState } from "./flowContext";

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>({
    isLoggedIn: false,
    userName: "Jayasri",
    musicProvider: null,
    headset: null,
  });

  const login = (email: string) => {
    const name = email?.split("@")[0] || "listener";
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    setState((prev) => ({
      ...prev,
      isLoggedIn: true,
      userName: formattedName,
    }));
  };

  const setMusicProvider = (provider: string) => {
    setState((prev) => ({
      ...prev,
      musicProvider: provider,
    }));
  };

  const setHeadset = (headset: string) => {
    setState((prev) => ({
      ...prev,
      headset,
    }));
  };

  const resetFlow = () => {
    setState({
      isLoggedIn: false,
      userName: "Jayasri",
      musicProvider: null,
      headset: null,
    });
  };

  const value = useMemo(
    () => ({
      state,
      login,
      setMusicProvider,
      setHeadset,
      resetFlow,
    }),
    [state]
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}