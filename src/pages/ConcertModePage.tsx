import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type AudioState = {
  energy: number;
  bass: number;
  mid: number;
  treble: number;
  beat: number;
};

type Ripple = {
  r: number;
  alpha: number;
  width: number;
  speed: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

type Stick = {
  angle: number;
  jitter: number;
  glow: number;
};

export default function ConcertModePage() {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(true);
  const animationTimeRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const sticksRef = useRef<Stick[]>([]);
  const lastBeatRef = useRef(0);
  const prevBassRef = useRef(0);
  const crowdPulseRef = useRef(0);
  const stateRef = useRef<AudioState>({
    energy: 0.32,
    bass: 0.35,
    mid: 0.3,
    treble: 0.34,
    beat: 0,
  });

  const [isRunning, setIsRunning] = useState(true);
  const [concertMode, setConcertMode] = useState(true);
  const [metrics, setMetrics] = useState({ energy: 32, bass: 35, mid: 30, treble: 34 });
  const TRACK_URL = "/sounds/rickroll.mp3";
  const shouldAutoPlay = ((location.state as { autoPlay?: boolean } | null)?.autoPlay ?? false);

  const COLORS = useMemo(
    () => ({
      bg0: "#04060b",
      bg1: "#0a1020",
      cyan: "#00f6ff",
      pink: "#ff41d6",
      lime: "#7bffbf",
      blue: "#6f91ff",
      text: "#dbe7ff",
      dim: "#8290b2",
    }),
    []
  );

  const STICK_COUNT = 72;
  const PARTICLE_COUNT = 320;

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const initSceneObjects = () => {
      if (!sticksRef.current.length) {
        sticksRef.current = Array.from({ length: STICK_COUNT }).map((_, i) => ({
          angle: (Math.PI * 2 * i) / STICK_COUNT,
          jitter: Math.random() * Math.PI * 2,
          glow: 0.3 + Math.random() * 0.5,
        }));
      }

      if (!particlesRef.current.length) {
        particlesRef.current = Array.from({ length: PARTICLE_COUNT }).map(() => {
          const a = Math.random() * Math.PI * 2;
          const r = 90 + Math.random() * Math.min(w, h) * 0.48;
          return {
            x: cx + Math.cos(a) * r,
            y: cy + Math.sin(a) * r,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: 1 + Math.random() * 2.8,
            alpha: 0.2 + Math.random() * 0.6,
          };
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      cx = w / 2;
      cy = h / 2;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initSceneObjects();
    };

    const triggerRipple = (strength: number) => {
      ripplesRef.current.push({
        r: 36,
        alpha: 0.28 + strength * 0.75,
        width: 2 + strength * 4,
        speed: 1.8 + strength * 6,
      });
      if (ripplesRef.current.length > 20) ripplesRef.current.shift();
    };

    const getBandAverage = (
      data: Uint8Array,
      sampleRate: number,
      minHz: number,
      maxHz: number
    ) => {
      const nyquist = sampleRate / 2;
      const binHz = nyquist / data.length;
      const start = Math.max(0, Math.floor(minHz / binHz));
      const end = Math.min(data.length - 1, Math.ceil(maxHz / binHz));
      if (end <= start) return 0;

      let total = 0;
      let count = 0;
      for (let i = start; i <= end; i += 1) {
        total += data[i];
        count += 1;
      }
      return count > 0 ? total / count / 255 : 0;
    };

    const processAudio = () => {
      const analyser = analyserRef.current;
      const data = dataArrayRef.current;
      const audioCtx = audioCtxRef.current;

      if (!analyser || !data || !audioCtx) {
        return false;
      }

      analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);

      const bass = getBandAverage(data, audioCtx.sampleRate, 20, 140);
      const mid = getBandAverage(data, audioCtx.sampleRate, 140, 2000);
      const treble = getBandAverage(data, audioCtx.sampleRate, 2000, 8000);
      const energy = bass * 0.45 + mid * 0.35 + treble * 0.2;

      const p = stateRef.current;
      const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
      p.bass = lerp(p.bass, bass, 0.25);
      p.mid = lerp(p.mid, mid, 0.2);
      p.treble = lerp(p.treble, treble, 0.28);
      p.energy = lerp(p.energy, energy, 0.22);
      p.beat = Math.max(0, p.bass - prevBassRef.current);

      const now = performance.now();
      if (concertMode && p.bass > 0.52 && p.beat > 0.05 && now - lastBeatRef.current > 150) {
        triggerRipple(Math.min(1, p.bass * 1.2));
        lastBeatRef.current = now;
      }

      prevBassRef.current = p.bass;
      return true;
    };

    const simulateAudio = (tMs: number) => {
      const t = tMs * 0.001;
      const p = stateRef.current;

      const drift = 0.45 + Math.sin(t * 0.4) * 0.15;
      const kick = Math.max(0, Math.sin(t * 6.2 + Math.sin(t * 0.25) * 1.1));
      const hat = Math.max(0, Math.sin(t * 17.5 + 0.8));
      const body = Math.max(0, Math.sin(t * 2.5 - 0.4));
      const randomness = Math.random() * 0.12;

      const bassTarget = 0.22 + kick * 0.58 + randomness * 0.2;
      const midTarget = 0.24 + body * 0.42 + hat * 0.16 + randomness * 0.25;
      const trebleTarget = 0.2 + hat * 0.62 + randomness * 0.32;
      const energyTarget =
        bassTarget * 0.45 + midTarget * 0.3 + trebleTarget * 0.25 + drift * 0.15;

      const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
      p.bass = lerp(p.bass, Math.min(1, bassTarget), 0.14);
      p.mid = lerp(p.mid, Math.min(1, midTarget), 0.12);
      p.treble = lerp(p.treble, Math.min(1, trebleTarget), 0.16);
      p.energy = lerp(p.energy, Math.min(1, energyTarget), 0.1);
      p.beat = kick;

      const now = animationTimeRef.current;
      if (concertMode && p.bass > 0.64 && now - lastBeatRef.current > 170) {
        triggerRipple(Math.min(1, p.bass * 1.15));
        lastBeatRef.current = now;
      }
    };

    const drawBackground = (t: number) => {
      const p = stateRef.current;
      const g = ctx.createRadialGradient(cx, cy, 40, cx, cy, Math.max(w, h) * 0.8);
      g.addColorStop(0, concertMode ? "#0f1d42" : COLORS.bg1);
      g.addColorStop(1, COLORS.bg0);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (!concertMode) return;

      for (let i = 0; i < 4; i++) {
        const pulse = Math.sin(t * 0.0018 + i * 1.1) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(111,145,255,${(0.03 + pulse * 0.06 + p.energy * 0.08).toFixed(3)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, 130 + i * 80 + pulse * 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawOrb = (t: number) => {
      const p = stateRef.current;
      const radius = 48 + p.bass * 26 + crowdPulseRef.current * 11;
      const aura = radius + 20 + p.mid * 30;

      const auraGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, aura);
      auraGrad.addColorStop(0, `rgba(0,246,255,${(0.28 + p.bass * 0.35).toFixed(3)})`);
      auraGrad.addColorStop(0.6, `rgba(111,145,255,${(0.2 + p.mid * 0.3).toFixed(3)})`);
      auraGrad.addColorStop(1, "rgba(255,65,214,0)");
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, aura, 0, Math.PI * 2);
      ctx.fill();

      const orbGrad = ctx.createRadialGradient(
        cx - radius * 0.25,
        cy - radius * 0.3,
        radius * 0.18,
        cx,
        cy,
        radius
      );
      orbGrad.addColorStop(0, "#ffffff");
      orbGrad.addColorStop(0.28, COLORS.cyan);
      orbGrad.addColorStop(1, COLORS.blue);
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${(0.2 + p.treble * 0.5).toFixed(3)})`;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 6 + Math.sin(t * 0.004) * 2, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawBeatBars = (t: number) => {
      const p = stateRef.current;
      const bars = 132;
      const innerR = 100;
      ctx.save();
      ctx.translate(cx, cy);

      for (let i = 0; i < bars; i++) {
        const ang = (Math.PI * 2 * i) / bars;
        const phase = i / bars;
        const wave = Math.sin(phase * 18 + t * 0.012) * 0.5 + 0.5;
        const level = p.energy * 0.7 + p.bass * 0.6 + wave * 0.28;
        const hBar = 10 + level * 90;

        ctx.save();
        ctx.rotate(ang);
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(0,246,255,${(0.22 + level * 0.7).toFixed(3)})`
            : `rgba(255,65,214,${(0.22 + level * 0.7).toFixed(3)})`;
        ctx.lineWidth = 1.8 + level * 2.2;
        ctx.beginPath();
        ctx.moveTo(innerR, 0);
        ctx.lineTo(innerR + hBar, 0);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    const drawRipples = () => {
      ripplesRef.current.forEach((r) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123,255,191,${r.alpha.toFixed(3)})`;
        ctx.lineWidth = r.width;
        ctx.stroke();
        r.r += r.speed;
        r.alpha *= 0.965;
      });
      ripplesRef.current = ripplesRef.current.filter(
        (r) => r.alpha > 0.03 && r.r < Math.max(w, h)
      );
    };

    const drawParticles = (t: number) => {
      const p = stateRef.current;
      const jitter = 0.02 + p.treble * 0.09;
      particlesRef.current.forEach((dot, i) => {
        const dx = cx - dot.x;
        const dy = cy - dot.y;
        dot.vx += dx * 0.0000009;
        dot.vy += dy * 0.0000009;
        dot.vx += (Math.random() - 0.5) * jitter;
        dot.vy += (Math.random() - 0.5) * jitter;

        dot.x += dot.vx * (0.8 + p.treble * 1.6);
        dot.y += dot.vy * (0.8 + p.treble * 1.6);

        const ox = dot.x - cx;
        const oy = dot.y - cy;
        const dist = Math.sqrt(ox * ox + oy * oy);
        const maxDist = Math.min(w, h) * 0.56;
        if (dist > maxDist) {
          const a = Math.atan2(oy, ox);
          dot.x = cx + Math.cos(a) * (90 + Math.random() * 50);
          dot.y = cy + Math.sin(a) * (90 + Math.random() * 50);
          dot.vx = (Math.random() - 0.5) * 0.4;
          dot.vy = (Math.random() - 0.5) * 0.4;
        }

        const flick = Math.sin(i * 0.13 + t * 0.005) * 0.5 + 0.5;
        const alpha = Math.max(
          0.08,
          Math.min(0.95, dot.alpha * (0.55 + flick * 0.55) + p.treble * 0.35)
        );
        ctx.fillStyle = `rgba(0,246,255,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size + p.treble * 1.4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawSticks = (t: number) => {
      const p = stateRef.current;
      const baseR = Math.min(w, h) * 0.42;
      sticksRef.current.forEach((s, i) => {
        const movement = Math.sin(t * 0.004 + s.jitter + i * 0.1) * 0.5 + 0.5;
        const pulse = crowdPulseRef.current * (0.35 + (i % 6) * 0.06);
        const len = 20 + movement * 28 + p.bass * 34 + pulse * 46;
        const r = baseR + Math.sin(t * 0.0018 + i * 0.05) * 10 + p.mid * 8;

        const x1 = cx + Math.cos(s.angle) * r;
        const y1 = cy + Math.sin(s.angle) * r;
        const x2 = cx + Math.cos(s.angle) * (r + len);
        const y2 = cy + Math.sin(s.angle) * (r + len);

        const alpha = 0.22 + s.glow * 0.3 + p.energy * 0.48 + pulse * 0.62;
        ctx.strokeStyle =
          i % 2 === 0
            ? `rgba(255,65,214,${Math.min(alpha, 0.98).toFixed(3)})`
            : `rgba(123,255,191,${Math.min(alpha, 0.98).toFixed(3)})`;
        ctx.lineWidth = 2.1 + p.bass * 1.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });
    };

    const tick = (rawTime: number) => {
      rafRef.current = requestAnimationFrame(tick);

      if (lastFrameRef.current === null) {
        lastFrameRef.current = rawTime;
      }
      const delta = rawTime - lastFrameRef.current;
      lastFrameRef.current = rawTime;

      if (isRunningRef.current) {
        animationTimeRef.current += delta;
        const hasAudioInput = processAudio();
        if (!hasAudioInput) simulateAudio(animationTimeRef.current);
        crowdPulseRef.current *= 0.93;
      }

      const t = animationTimeRef.current;
      drawBackground(t);
      drawSticks(t);
      drawRipples();
      drawParticles(t);
      drawBeatBars(t);
      drawOrb(t);

      const p = stateRef.current;
      setMetrics((prev) => {
        const next = {
          energy: Math.round(p.energy * 100),
          bass: Math.round(p.bass * 100),
          mid: Math.round(p.mid * 100),
          treble: Math.round(p.treble * 100),
        };
        if (
          next.energy === prev.energy &&
          next.bass === prev.bass &&
          next.mid === prev.mid &&
          next.treble === prev.treble
        ) {
          return prev;
        }
        return next;
      });
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastFrameRef.current = null;
    };
  }, [COLORS, concertMode]);

  const ensureAudioGraph = useCallback(async () => {
    const audioEl = audioRef.current;
    if (!audioEl) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return null;

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }

    if (!sourceNodeRef.current) {
      const source = audioCtx.createMediaElementSource(audioEl);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.84;

      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      sourceNodeRef.current = source;
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    return audioEl;
  }, []);

  const startPlayback = useCallback(async () => {
    const audioEl = await ensureAudioGraph();
    if (!audioEl) return;
    audioEl.volume = 1;
    await audioEl.play();
    setIsRunning(true);
  }, [ensureAudioGraph]);

  const autoStartPlayback = useCallback(async () => {
    const audioEl = await ensureAudioGraph();
    if (!audioEl) return;
    audioEl.volume = 1;
    await audioEl.play();
  }, [ensureAudioGraph]);

  useEffect(() => {
    if (!shouldAutoPlay) return;

    autoStartPlayback().catch(() => {
      // ignore autoplay failures (browser policies may block without gesture)
    });
  }, [autoStartPlayback, shouldAutoPlay]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      sourceNodeRef.current = null;
      analyserRef.current = null;
      dataArrayRef.current = null;
      audioCtxRef.current?.close().catch(() => {
        // ignore close errors
      });
      audioCtxRef.current = null;
    },
    []
  );

  const triggerCrowdPulse = () => {
    crowdPulseRef.current = 1;
    ripplesRef.current.push({ r: 50, alpha: 0.92, width: 3.4, speed: 6.4 });
    ripplesRef.current.push({ r: 78, alpha: 0.78, width: 2.4, speed: 4.8 });
  };

  const togglePlayback = async () => {
    if (isRunningRef.current) {
      setIsRunning(false);
      audioRef.current?.pause();
      return;
    }

    startPlayback().catch(() => {
      setIsRunning(false);
    });
  };

  const ui = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 15% 20%, rgba(0,246,255,0.15), transparent 35%), radial-gradient(circle at 80% 8%, rgba(255,65,214,0.14), transparent 30%), radial-gradient(circle at 75% 85%, rgba(123,255,191,0.11), transparent 28%), #03050a",
      color: COLORS.text,
      fontFamily: '"Space Grotesk", "Sora", "Segoe UI", sans-serif',
      display: "grid",
      placeItems: "center",
      padding: "22px",
    },
    shell: {
      width: "min(1120px, 100%)",
      borderRadius: "22px",
      border: "1px solid rgba(120, 154, 235, 0.26)",
      background: "rgba(6, 10, 21, 0.87)",
      overflow: "hidden",
      boxShadow: "0 40px 100px rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(6px)",
    },
    top: {
      padding: "18px 18px 14px",
      display: "grid",
      gap: "12px",
      borderBottom: "1px solid rgba(120, 154, 235, 0.22)",
      gridTemplateColumns: "1.2fr 1fr",
    },
    title: {
      margin: 0,
      fontSize: "clamp(1.2rem, 3vw, 2rem)",
      fontWeight: 700,
      letterSpacing: "0.015em",
    },
    copy: {
      margin: "8px 0 0",
      maxWidth: "56ch",
      color: COLORS.dim,
      lineHeight: 1.5,
      fontSize: "0.92rem",
    },
    controls: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: "10px",
    },
    btn: {
      border: "1px solid rgba(120, 154, 235, 0.55)",
      background: "rgba(8, 14, 28, 0.86)",
      color: COLORS.text,
      borderRadius: "11px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 600,
      letterSpacing: "0.03em",
    },
    btnPrimary: {
      border: "1px solid rgba(0,246,255,0.65)",
      background: "linear-gradient(130deg, rgba(0,246,255,0.18), rgba(111,145,255,0.22))",
      color: "#dcfaff",
      borderRadius: "11px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: 700,
      letterSpacing: "0.03em",
    },
    view: {
      position: "relative",
      width: "100%",
      aspectRatio: "16/9",
      background: "#05080f",
    },
    canvas: {
      width: "100%",
      height: "100%",
      display: "block",
    },
    panel: {
      position: "absolute",
      left: 14,
      bottom: 14,
      minWidth: "240px",
      padding: "12px",
      borderRadius: "12px",
      border: "1px solid rgba(120, 154, 235, 0.28)",
      background: "rgba(8, 12, 24, 0.7)",
      backdropFilter: "blur(4px)",
    },
    meterRow: {
      marginTop: "10px",
      display: "grid",
      gap: "8px",
    },
    meterLine: {
      display: "grid",
      gridTemplateColumns: "58px 1fr 42px",
      alignItems: "center",
      gap: "8px",
      fontSize: "0.78rem",
    },
    meterTrack: {
      height: "8px",
      borderRadius: "999px",
      background: "rgba(50, 67, 104, 0.45)",
      overflow: "hidden",
    },
    footer: {
      borderTop: "1px solid rgba(120, 154, 235, 0.2)",
      padding: "11px 16px",
      display: "flex",
      justifyContent: "space-between",
      gap: "8px",
      flexWrap: "wrap",
      color: COLORS.dim,
      fontSize: "0.82rem",
    },
  } as const;

  const meter = (label: string, value: number, gradient: string) => (
    <div style={ui.meterLine} key={label}>
      <span style={{ color: COLORS.dim, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <div style={ui.meterTrack}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: "inherit",
            background: gradient,
            boxShadow: `0 0 14px ${label === "bass" ? "rgba(255,65,214,0.45)" : "rgba(0,246,255,0.45)"}`,
            transition: "width 120ms linear",
          }}
        />
      </div>
      <span style={{ textAlign: "right", fontWeight: 700 }}>{value}%</span>
    </div>
  );

  return (
    <div style={ui.page}>
      <div style={ui.shell}>
        <div style={ui.top}>
          <div>
            <h1 style={ui.title}>Concert Mode Prototype</h1>
            <p style={ui.copy}>
              A personal stage simulation where visuals carry the emotion: center aura, crowd light sticks,
              pulse waves, and high-frequency particles. No setup needed, just run and feel the room move.
            </p>
          </div>

          <div style={ui.controls}>
            <button style={ui.btnPrimary} onClick={togglePlayback}>
              {isRunning ? "Pause Music" : "Resume Music"}
            </button>
            <button style={ui.btn} onClick={() => setConcertMode((v) => !v)}>
              {concertMode ? "Concert Mode: ON" : "Concert Mode: OFF"}
            </button>
            <button style={ui.btn} onClick={triggerCrowdPulse}>
              Crowd Pulse
            </button>
          </div>
        </div>

        <div style={ui.view}>
          <audio ref={audioRef} src={TRACK_URL} preload="auto" loop />
          <canvas ref={canvasRef} style={ui.canvas} />

          <div style={ui.panel}>
            <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>Live Emotion Meter</div>
            <div style={{ color: COLORS.dim, fontSize: "0.78rem", marginTop: "4px" }}>
              Procedural concert dynamics, fluctuating in real time.
            </div>
            <div style={ui.meterRow}>
              {meter("energy", metrics.energy, "linear-gradient(90deg, #00f6ff, #6f91ff)")}
              {meter("bass", metrics.bass, "linear-gradient(90deg, #ff41d6, #6f91ff)")}
              {meter("mid", metrics.mid, "linear-gradient(90deg, #6f91ff, #00f6ff)")}
              {meter("treble", metrics.treble, "linear-gradient(90deg, #7bffbf, #00f6ff)")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
