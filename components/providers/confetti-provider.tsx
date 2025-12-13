"use client";

import ReactConfetti from "react-confetti";
import { useEffect, useState } from "react";

import { useConfettiStore } from "@/hooks/use-confetti-store";

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!confetti.isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={500}
        recycle={false}
        onConfettiComplete={() => {
          confetti.onClose();
        }}
      />
    </div>
  );
};
