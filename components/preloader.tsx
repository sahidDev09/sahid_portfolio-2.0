import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
  isHeroLoaded?: boolean;
}

const Preloader = ({ onComplete, isHeroLoaded = false }: PreloaderProps) => {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"init" | "loading" | "complete">("init");
  const counterRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const initTimer = setTimeout(() => {
      setPhase("loading");
    }, 500);

    return () => clearTimeout(initTimer);
  }, []);

  // Start initial slow animation
  useEffect(() => {
    if (phase !== "loading" || isHeroLoaded) return;

    const obj = { value: 0 };

    animationRef.current = gsap.to(obj, {
      value: 100,
      duration: 3.0,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(obj.value));
      },
      onComplete: () => {
        setPhase("complete");
        setTimeout(onComplete, 600);
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [phase, onComplete, isHeroLoaded]);

  // When hero loads, quickly complete to 100%
  useEffect(() => {
    if (phase !== "loading" || !isHeroLoaded) return;

    // Kill slow animation if running
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const obj = { value: count };
    const remainingProgress = 100 - count;
    const duration = Math.max(0.3, (remainingProgress / 100) * 0.5);

    animationRef.current = gsap.to(obj, {
      value: 100,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(obj.value));
      },
      onComplete: () => {
        setPhase("complete");
        setTimeout(onComplete, 600);
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [phase, onComplete, isHeroLoaded, count]);

  const terminalLines = [
    { text: "$ cd portfolio", delay: 0 },
    { text: "$ npm install", delay: 0.2 },
    { text: "✓ Installing dependencies...", delay: 0.4 },
    { text: "$ npm run dev", delay: 0.6 },
  ];

  return (
    <AnimatePresence>
      {phase !== "complete" && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-b from-[#0a0f14] to-[#28054a2f] overflow-hidden"
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}>
          {/* Scanlines overlay */}
          <div
            className="pointer-events-none fixed inset-0 z-50 opacity-30"
            style={{
              background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)`,
            }}
          />

          {/* Terminal window */}
          <div className="relative w-full max-w-2xl mx-4 md:mx-8">
            {/* Terminal header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#1a1f26]/50 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-[#30363d]/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]/80" />
              </div>
              <span className="ml-4 text-xs text-[#8b949e]">
                terminal — portfolio
              </span>
            </motion.div>

            {/* Terminal body */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#161b22]/90 backdrop-blur-sm rounded-b-lg p-6 md:p-8 border border-[#30363d]/30 border-t-0">
              {/* Terminal lines */}
              <div className="space-y-2 mb-8">
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: line.delay }}
                    className="font-mono text-sm md:text-base 2xl:text-xl">
                    <span
                      className={
                        line.text.startsWith("✓")
                          ? "text-[#8618FF] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                          : line.text.startsWith("$")
                          ? "text-[#79c0ff] drop-shadow-[0_0_10px_rgba(121,192,255,0.8)]"
                          : "text-[#8b949e]"
                      }>
                      {line.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Loading section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="space-y-4">
                {/* Progress bar */}
                <div className="relative h-1 bg-[#21262d] rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-linear-to-r from-[#8105FF] to-[#9730FF] shadow-[0_0_20px_rgba(0,255,136,0.5)]"
                    style={{ width: `${count}%` }}
                  />
                </div>

                {/* Counter and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[#8618FF] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]">
                      ➜
                    </span>
                    <span className="text-[#8b949e] text-sm">Compiling...</span>
                    <span className="text-[#8618FF] animate-[blink_1s_step-end_infinite]">
                      ▌
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      ref={counterRef}
                      className="text-3xl md:text-4xl 2xl:text-6xl font-bold text-[#993aff] tabular-nums animate-[pulse-glow_2s_ease-in-out_infinite]">
                      {count}
                    </span>
                    <span className="text-xl md:text-2xl 2xl:text-4xl text-[#8b949e]">
                      %
                    </span>
                  </div>
                </div>

                {/* Status messages */}
                <motion.div
                  className="text-xs text-[#8b949e]/70 space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}>
                  {count > 20 && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}>
                      ✓ Building components...
                    </motion.p>
                  )}
                  {count > 50 && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}>
                      ✓ Optimizing assets...
                    </motion.p>
                  )}
                  {count > 80 && (
                    <motion.p
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}>
                      ✓ Ready to launch...
                    </motion.p>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-8 left-8 text-xs text-[#8b949e]/50 hidden md:block">
            <p>localhost:3000</p>
          </div>

          <div className="absolute bottom-8 right-8 text-xs text-[#8b949e]/50 hidden md:block">
            <p>v1.0.0</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
