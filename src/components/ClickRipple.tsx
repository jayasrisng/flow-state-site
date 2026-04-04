import { useEffect, useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
};

export default function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const ripple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev, ripple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 800);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none fixed z-[2] block h-8 w-8 rounded-full border border-cyan-300/50"
          style={{
            left: ripple.x - 16,
            top: ripple.y - 16,
            animation: "flowRipple 0.8s ease-out forwards",
            boxShadow: "0 0 24px rgba(31,220,255,0.22)",
          }}
        />
      ))}
    </>
  );
}