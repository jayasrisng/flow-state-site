import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[1] h-72 w-72 rounded-full blur-3xl transition-transform duration-150"
      style={{
        left: position.x - 144,
        top: position.y - 144,
        background:
        "radial-gradient(circle, rgba(31,220,255,0.22) 0%, rgba(143,76,255,0.16) 35%, rgba(213,66,255,0.12) 52%, rgba(0,0,0,0) 72%)",
      }}
    />
  );
}