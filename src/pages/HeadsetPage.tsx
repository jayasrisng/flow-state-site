import { useNavigate } from "react-router-dom";
import { CheckCircle2, HeadsetIcon } from "lucide-react";
import NavBar from "../components/NavBar";
import { useFlow } from "../context/useFlow";
import { headsets } from "../data/mockData";

export default function HeadsetPage() {
  const navigate = useNavigate();
  const { state, setHeadset } = useFlow();

  return (
    <div className="min-h-screen">
      <div className="noise" />
      <NavBar />

      <section className="section-shell py-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            step 3
          </p>
          <h1 className="mt-3 text-4xl font-semibold">choose your listening setup</h1>
          <p className="mt-4 max-w-2xl text-white/62">
            Select a headset or stay on desktop. Pairing is simulated instantly.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {headsets.map((item) => {
              const selected = state.headset === item;

              return (
                <button
                  key={item}
                  onClick={() => setHeadset(item)}
                  className={`glass glow-card rounded-[1.75rem] p-6 text-left transition ${
                    selected ? "ring-2 ring-violet-300/70" : ""
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8">
                      <HeadsetIcon className="h-5 w-5 text-cyan-300" />
                    </div>
                    {selected && (
                      <CheckCircle2 className="h-5 w-5 text-violet-300" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{item}</h3>
                  <p className="mt-2 text-sm text-white/60">
                    {selected ? "pairing successful" : "tap to simulate pairing"}
                  </p>
                </button>
              );
            })}
          </div>

          {state.headset && (
            <div className="mt-8 rounded-[1.75rem] border border-violet-300/20 bg-violet-300/10 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-violet-300" />
                <div>
                  <p className="font-medium text-white">{state.headset} is paired</p>
                  <p className="mt-1 text-sm text-white/62">
                    visual sync and concert mode rendering profile are now ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              className="btn-secondary"
              disabled={!state.headset}
              onClick={() => navigate("/launch")}
            >
              continue to launch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}