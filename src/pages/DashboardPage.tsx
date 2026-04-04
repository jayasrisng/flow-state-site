import { Link } from "react-router-dom";
import {
  Disc3,
  Headphones,
  ListMusic,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import NavBar from "../components/NavBar";
import { useFlow } from "../context/useFlow";
import {
  artists,
  dashboardStats,
  partySession,
  playlists,
  recentTracks,
} from "../data/mockData";

export default function DashboardPage() {
  const { state, resetFlow } = useFlow();

  return (
    <div className="min-h-screen pb-14">
      <div className="noise" />
      <NavBar />

      <section className="section-shell py-12">
        <div className="glass rounded-4xl p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
                app ready
              </p>
              <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
                you’re ready for concert mode
              </h1>
              <p className="mt-4 max-w-2xl text-white/62">
                {state.userName}, your music ecosystem is synced and your immersive
                session is ready to launch.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/concert-mode" state={{ autoPlay: true }} className="btn-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                enter concert mode
              </Link>
              <Link to="/" className="btn-secondary" onClick={resetFlow}>
                reset demo
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                provider
              </p>
              <p className="mt-2 text-lg font-medium">{state.musicProvider}</p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                headset
              </p>
              <p className="mt-2 text-lg font-medium">{state.headset}</p>
            </div>

            {dashboardStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/8 bg-white/4 p-4"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                  {stat.label}
                </p>
                <p className="mt-2 text-lg font-medium capitalize">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="glass rounded-4xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8">
                  <ListMusic className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">top playlists</h2>
                  <p className="text-sm text-white/55">synced from your demo library</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.title}
                    className="rounded-3xl border border-white/8 bg-white/4 p-4"
                  >
                    <div className="relative mb-4 h-28 w-full overflow-hidden rounded-[1.25rem]">
                      <img
                        src={playlist.image}
                        alt={playlist.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
                    </div>
                    <h3 className="text-lg font-medium capitalize">{playlist.title}</h3>
                    <p className="mt-2 text-sm text-white/58">{playlist.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass rounded-4xl p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8">
                    <Disc3 className="h-5 w-5 text-fuchsia-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">favorite artists</h2>
                    <p className="text-sm text-white/55">recently active</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {artists.map((artist) => (
                    <div
                      key={artist}
                      className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                    >
                      {artist}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-4xl p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8">
                    <Headphones className="h-5 w-5 text-violet-300" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold">recently played</h2>
                    <p className="text-sm text-white/55">session memory loaded</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {recentTracks.map((track, index) => (
                    <div
                      key={track}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                    >
                      <span>{track}</span>
                      <span className="text-sm text-white/45">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-4xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8">
                  <Radio className="h-5 w-5 text-cyan-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">station mode</h2>
                  <p className="text-sm text-white/55">
                    shared room concert experience
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-300/15 bg-cyan-300/8 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/70">
                  live session
                </p>
                <h3 className="mt-3 text-2xl font-semibold capitalize">
                  {partySession.title}
                </h3>
                <div className="mt-5 space-y-3 text-white/72">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-cyan-300" />
                    host: {partySession.host}
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-cyan-300" />
                    {partySession.attendees} people connected
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-cyan-300" />
                    current vibe: {partySession.vibe}
                  </div>
                </div>

                <button className="btn-primary mt-6 w-full">
                  join shared concert room
                </button>
              </div>
            </div>

            <div className="glass rounded-4xl p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                synced status
              </p>
              <div className="mt-5 space-y-4">
                {[
                  "music provider authenticated",
                  "visual profile activated",
                  "device pairing complete",
                  "party mode available",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-3"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                    <span className="text-white/74 capitalize">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
