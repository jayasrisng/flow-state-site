import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useFlow } from "../context/useFlow";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useFlow();

  const [email, setEmail] = useState("jayasrisng@gmail.com");
  const [password, setPassword] = useState("demo1234");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    navigate("/connect");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* background noise */}
      <div className="noise" />

      {/* navbar */}
      <NavBar />

      {/* main section */}
      <section className="section-shell flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-20 pt-28">
        <div className="glass w-full max-w-md rounded-4xl p-8">
          
          {/* header */}
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300/80">
            step 1
          </p>

          <h1 className="mt-3 text-3xl font-semibold">
            log in to Flow State
          </h1>

          <p className="mt-3 text-white/62">
            step into the music world.
          </p>

          {/* form */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            
            {/* email */}
            <div>
              <label className="mb-2 block text-sm text-white/65">
                email
              </label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {/* password */}
            <div>
              <label className="mb-2 block text-sm text-white/65">
                password
              </label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {/* submit */}
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              continue to music connect
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          {/* social */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="btn-secondary">
              continue with google
            </button>
            <button className="btn-secondary">
              continue with apple
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}