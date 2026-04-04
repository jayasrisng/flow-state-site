import { Link, useLocation } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function NavBar() {
  const location = useLocation();
  const [soundOn, setSoundOn] = useState(true);

  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/20 backdrop-blur-xl">
      <div className="section-shell flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl ring-1 ring-white/10 transition duration-300 group-hover:ring-cyan-300/30">
            <img
              src={logo}
              alt="Flow State logo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-transparent to-fuchsia-400/10 opacity-70" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/85">
              Flow State
            </p>
            <p className="text-xs text-white/45">
              music as a live environment
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          {isLanding && (
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="#how-it-works"
                className="text-sm text-white/65 transition hover:text-cyan-300"
              >
                enter the flow
              </a>
              <a
                href="#features"
                className="text-sm text-white/65 transition hover:text-cyan-300"
              >
                how it opens up
              </a>
              <a
                href="#mission"
                className="text-sm text-white/65 transition hover:text-cyan-300"
              >
                why this matters
              </a>
              <a
                href="#team"
                className="text-sm text-white/65 transition hover:text-cyan-300"
              >
                who’s building it
              </a>
            </nav>
          )}

          <button
            type="button"
            onClick={() => setSoundOn((prev) => !prev)}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-cyan-300/25 hover:bg-white/8 hover:text-cyan-300 sm:inline-flex"
            aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
            title={soundOn ? "sound on" : "sound off"}
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          <Link to="/login" className="btn-primary">
            start demo
          </Link>
        </div>
      </div>
    </header>
  );
}