import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Music4 } from "lucide-react";
import NavBar from "../components/NavBar";
import { useFlow } from "../context/useFlow";
import { musicProviders } from "../data/mockData";

export default function ConnectPage() {
  const navigate = useNavigate();
  const { state, setMusicProvider } = useFlow();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConnect = (provider: string) => {
    setMusicProvider(provider);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen">
      <div className="noise" />
      <NavBar />

      <section className="section-shell py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            step 2
          </p>
          <h1 className="mt-3 text-4xl font-semibold">connect your music service</h1>
          <p className="mt-4 max-w-2xl text-white/62">
            welcome, {state.userName}. connect your streaming service to sync your playlists, artists, and listening history for the full Flow State experience.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {musicProviders.map((provider) => {
              const selected = state.musicProvider === provider.name;

              return (
                <div
                  key={provider.name}
                  className={`glass glow-card rounded-4xl p-6 transition ${
                    selected ? "ring-2 ring-cyan-300/60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8">
                        <Music4 className="h-6 w-6 text-fuchsia-300" />
                      </div>
                      <h2 className="text-2xl font-semibold">{provider.name}</h2>
                    </div>
                    {selected && (
                      <CheckCircle2 className="h-6 w-6 text-cyan-300" />
                    )}
                  </div>

                  <button
                    className="btn-primary mt-8 w-full"
                    onClick={() => handleConnect(provider.name)}
                  >
                    connect {provider.name}
                  </button>
                </div>
              );
            })}
          </div>

          {showSuccess && state.musicProvider && (
            <div className="mt-8 rounded-[1.75rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-300" />
                <div>
                  <p className="font-medium text-white">
                    {state.musicProvider} connected successfully
                  </p>
                  <p className="mt-1 text-sm text-white/62">
                    authorization complete. playlists and listening history are
                    now ready for Flow State.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              className="btn-secondary"
              disabled={!state.musicProvider}
              onClick={() => navigate("/headset")}
            >
              continue to headset pairing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}