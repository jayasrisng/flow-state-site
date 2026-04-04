import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Music3, RadioTower } from "lucide-react";
import NavBar from "../components/NavBar";
import { useFlow } from "../context/useFlow";

export default function LaunchPage() {
  const navigate = useNavigate();
  const { state } = useFlow();

  return (
    <div className="min-h-screen">
      <div className="noise" />
      <NavBar />

      <section className="section-shell flex min-h-[calc(100vh-72px)] items-center justify-center py-16">
        <div className="glass glow-card w-full max-w-3xl rounded-4xl p-8 md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300/10">
              <CheckCircle2 className="h-8 w-8 text-cyan-300" />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-cyan-300/80">
              step 4
            </p>
            <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
              everything is ready
            </h1>
            <p className="mt-4 text-lg text-white/62">
              your provider, listening profile, and device are synced for concert
              mode
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <Music3 className="mx-auto h-5 w-5 text-fuchsia-300" />
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/45">
                  provider
                </p>
                <p className="mt-2 font-medium">{state.musicProvider}</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <RadioTower className="mx-auto h-5 w-5 text-cyan-300" />
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/45">
                  headset
                </p>
                <p className="mt-2 font-medium">{state.headset}</p>
              </div>
              <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
                <CheckCircle2 className="mx-auto h-5 w-5 text-violet-300" />
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-white/45">
                  status
                </p>
                <p className="mt-2 font-medium">ready to launch</p>
              </div>
            </div>

            <button
              className="btn-primary mt-10"
              onClick={() => navigate("/dashboard")}
            >
              open concert mode
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}