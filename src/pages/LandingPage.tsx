import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import NavBar from "../components/NavBar";
import SectionTitle from "../components/SectionTitle";
import {
  features,
  howItWorks,
  teamMembers,
  featureHighlights,
} from "../data/mockData";
import CursorGlow from "../components/CursorGlow";
import ClickRipple from "../components/ClickRipple";

export default function LandingPage() {
  const assetBase = import.meta.env.BASE_URL;

  return (
    <div className="relative min-h-screen">
      <CursorGlow /> 
      <ClickRipple />
      <div className="noise" />
      <NavBar />

      <main>
        <section className="section-shell grid min-h-[88vh] items-center gap-14 py-18 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              immersive concert mode for music lovers
            </div>

            <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            turn every song into a
            <span className="bg-linear-to-r from-violet-300 via-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
             {" "}living visual experience
            </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Flow State is an immersive concert mode that transforms everyday listening
              into motion, atmosphere, and presence.. whether you’re on a headset, on a screen,
              or sharing the vibe with a room.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/login" className="btn-primary">
                start demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a href="#features" className="btn-secondary">
                <PlayCircle className="mr-2 h-4 w-4" />
                watch concert mode
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/58">
              <span>spotify + apple music demo</span>
              <span>vr headset pairing</span>
              <span>party / station mode</span>
            </div>
          </div>

          <div className="glass glow-card rounded-4xl p-6">
            <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-white/45">
                    now entering
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">concert mode</h3>
                </div>
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <span className="pulse-ring absolute inset-0 rounded-full border border-cyan-300/50" />
                  <span className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_22px_rgba(103,232,249,0.9)]" />
                </div>
              </div>

              <div className="grid gap-4">
                {featureHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-white/8 bg-white/4 p-4"
                    >
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/7">
                        <Icon className="h-5 w-5 text-violet-300" />
                      </div>
                      <h4 className="font-medium text-white">{item.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-white/62">
                        {item.text}
                      </p>
                    </div>
                  );
                })}

                <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/8 p-4">
                  <p className="text-sm text-cyan-100/85">
                    demo flow:
                    <span className="ml-2 text-white">
                      login → connect music → pair headset → launch
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-shell py-20 relative">

          <img
            src={`${assetBase}logo.png`}
            alt="flow state logo"
            className="pointer-events-none absolute right-10 top-10 w-68 opacity-80"
          />

          <SectionTitle
            eyebrow="how it works"
            title="your music goes from passive listening to a full sensory experience"
            text="connect your music, pick your device, and launch into an immersive environment built around the songs you already love. flow state makes everyday listening feel more vivid, emotional, and alive."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((step, index) => (
              <div
                key={step.title}
                className="glass glow-card rounded-[1.75rem] p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-sm font-semibold text-cyan-300">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-medium capitalize">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/62">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="section-shell py-20">
          <SectionTitle
            eyebrow="features"
            title="built to feel premium, immersive, and ready from the first tap"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass glow-card rounded-[1.75rem] p-6"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8">
                    <Icon className="h-5 w-5 text-fuchsia-300" />
                  </div>
                  <h3 className="text-xl font-medium capitalize">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section id="mission" className="section-shell py-20">
          <div className="glass rounded-4xl p-8 md:p-12">
            <SectionTitle
              eyebrow="mission"
              title="not everyone can go to a live concert, but everyone deserves the feeling"
              text="Flow State brings music immersion home. It makes listening more emotional, more visual, and more accessible through an experience that is instant, beautiful, and flexible across XR and desktop."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "make music feel bigger than headphones alone",
                "bring concert energy home in one tap",
                "lower the barrier to immersive experiences",
                "create something accessible, social, and beautiful",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-cyan-300" />
                    <p className="text-white/74">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="team" className="section-shell py-20 relative">
          <img
            src={`${assetBase}team.JPG`}
            alt="team"
            className="pointer-events-none absolute right-10 top-10 w-68 opacity-80"
          />
          <SectionTitle
            eyebrow="team"
            title="small team, big concert energy"
            text="a focused team reimagining how music is experienced in a spatial, immersive world."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="glass glow-card rounded-[1.75rem] p-6"
              >
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/45">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-7 text-white/62">
                  Building a more immersive future for everyday music moments.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="section-shell border-t border-white/8 py-8 text-sm text-white/45">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Flow State. hackathon demo website.</p>
          <p>music × xr × immersive visuals</p>
        </div>
      </footer>
    </div>
  );
}
