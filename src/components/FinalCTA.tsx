import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface FinalCTAProps {
  isDarkTheme: boolean;
  onDemoClick: () => void;
}

export function FinalCTA({ isDarkTheme, onDemoClick }: FinalCTAProps) {
  // ПАРАЛЛАКС СПОТЛАЙТА
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spotlightX = useTransform(mouseX, (v) => `calc(${v}px - 50%)`);
  const spotlightY = useTransform(mouseY, (v) => `calc(${v}px - 50%)`);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // 3D Tilt логика
  const tiltRef = useRef<HTMLButtonElement | null>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const tiltRotateX = useTransform(tiltY, [-50, 50], [8, -8]);
  const tiltRotateY = useTransform(tiltX, [-50, 50], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    tiltX.set(x);
    tiltY.set(y);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      className={`
        relative py-40 px-6 overflow-hidden
        ${isDarkTheme ? "bg-black" : "bg-gray-50"}
      `}
    >
      {/* АНИМИРОВАННЫЙ ФОН (динамический градиент) */}
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0.6 }}
        transition={{
          repeat: Infinity,
          duration: 7,
          repeatType: "mirror",
        }}
        className="
          absolute inset-0 -z-20 blur-3xl
          bg-[conic-gradient(from_90deg,_#4F46E5_0%,_#7C3AED_25%,_#EC4899_50%,_#4F46E5_100%)]
          opacity-30
        "
      />

      {/* ПАРАЛЛАКС СПОТЛАЙТ */}
      <motion.div
        style={{ left: spotlightX, top: spotlightY }}
        className={`
          absolute w-[750px] h-[750px] -z-10 rounded-full pointer-events-none
          ${
            isDarkTheme
              ? "bg-[radial-gradient(circle,_rgba(79,70,229,0.45)_0%,_transparent_70%)]"
              : "bg-[radial-gradient(circle,_rgba(79,70,229,0.25)_0%,_transparent_70%)]"
          }
        `}
      />

      <div className="relative max-w-7xl mx-auto text-center z-10">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`
            text-4xl md:text-5xl font-semibold mb-12
            ${isDarkTheme ? "text-white" : "text-gray-900"}
          `}
        >
          Готовы вывести юридические процессы на новый уровень?
        </motion.h2>

        {/* CTA кнопка + 3D tilt + light sweep */}
        <motion.button
          ref={tiltRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          style={{
            rotateX: tiltRotateX,
            rotateY: tiltRotateY,
            transformPerspective: 800,
          }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={onDemoClick}
          className="
            relative px-14 py-5 text-xl rounded-xl font-semibold
            bg-[#4F46E5] text-white shadow-2xl hover:bg-[#4338CA]
            transition-all duration-300 overflow-hidden
          "
        >
          Забронировать демо

          {/* LIGHT SWEEP — луч света, проходящий слева направо */}
          <motion.span
            initial={{ x: "-120%" }}
            animate={{ x: "220%" }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 1.2,
            }}
            className="
              absolute top-0 h-full w-1/5 
              bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]
              opacity-60 blur-md
            "
          />

          {/* BREATHING GLOW */}
          <motion.span
            initial={{ opacity: 0.35, scale: 0.92 }}
            animate={{ opacity: 0.8, scale: 1.1 }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="
              absolute inset-0 -z-20 rounded-xl
              bg-[radial-gradient(circle,_rgba(124,58,237,0.55)_0%,_transparent_70%)]
              blur-2xl
            "
          />

          {/* PULSING AURA */}
          <motion.span
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0.6, scale: 1.25 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="
              absolute inset-0 -z-10 rounded-xl
              bg-[radial-gradient(circle,_rgba(99,102,241,0.55)_0%,_transparent_70%)]
              blur-xl
            "
          />

          {/* WAVE BORDER */}
          <motion.span
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="
              absolute inset-0 rounded-xl border-2 border-[#7C3AED]
              [mask:linear-gradient(0deg,transparent_0%,black_40%,black_60%,transparent_100%)]
              animate-[spin_3s_linear_infinite]
            "
          />
        </motion.button>
      </div>
    </section>
  );
}
