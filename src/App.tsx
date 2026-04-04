import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ConnectPage from "./pages/ConnectPage";
import HeadsetPage from "./pages/HeadsetPage";
import LaunchPage from "./pages/LaunchPage";
import DashboardPage from "./pages/DashboardPage";
import ConcertModePage from "./pages/ConcertModePage";
import { useFlow } from "./context/useFlow";
import { playClickSound } from "./utils/playClickSound";

function ProtectedRoute({
  children,
  allow,
  redirectTo,
}: {
  children: ReactElement;
  allow: boolean;
  redirectTo: string;
}) {
  if (!allow) return <Navigate to={redirectTo} replace />;
  return children;
}

export default function App() {
  const { state } = useFlow();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]') ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea")
      ) {
        playClickSound();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/connect"
        element={
          <ProtectedRoute allow={state.isLoggedIn} redirectTo="/login">
            <ConnectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/headset"
        element={
          <ProtectedRoute allow={!!state.musicProvider} redirectTo="/connect">
            <HeadsetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/launch"
        element={
          <ProtectedRoute allow={!!state.headset} redirectTo="/headset">
            <LaunchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allow={state.isLoggedIn && !!state.musicProvider && !!state.headset}
            redirectTo="/"
          >
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/concert-mode"
        element={
          <ProtectedRoute
            allow={state.isLoggedIn && !!state.musicProvider && !!state.headset}
            redirectTo="/"
          >
            <ConcertModePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
