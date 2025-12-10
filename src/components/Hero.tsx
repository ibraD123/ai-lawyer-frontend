import { motion, useMotionValue, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

interface HeroProps {
  isDarkTheme: boolean;
  onDemoClick: () => void;
}

export function Hero({ isDarkTheme, onDemoClick }: HeroProps) {
  // -----------------------------
  //  ПАРАЛЛАКС ФОНА (СПОТЛАЙТ)
  // -----------------------------
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const parallaxX = useTransform(mouseX, (v) => `calc(${v}px - 50%)`);
  const parallaxY = useTransform(mouseY, (v) => `calc(${v}px - 50%)`);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // -----------------------------
  //  АНИМАЦИЯ ТЕКСТА ПРИ СКРОЛЛЕ
  // -----------------------------
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "start center"],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  // -----------------------------
  //  3D TILT + LIGHT SWEEP BUTTON
  // -----------------------------
  const tiltRef = useRef<HTMLButtonElement | null>(null);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const rotateX = useTransform(tiltY, [-40, 40], [10, -10]);
  const rotateY = useTransform(tiltX, [-40, 40], [-10, 10]);

  const handleMove = (e: React.MouseEvent) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    tiltX.set(e.clientX - (rect.left + rect.width / 2));
    tiltY.set(e.clientY - (rect.top + rect.height / 2));
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      ref={scrollRef}
      className={`
        pt-40 pb-32 px-6 relative overflow-hidden
        ${isDarkTheme ? "bg-black" : "bg-white"}
      `}
    >
      {/* Параллакс-спотлайт */}
      <motion.div
        style={{ left: parallaxX, top: parallaxY }}
        className={`
          absolute w-[900px] h-[900px] rounded-full blur-3xl -z-20 pointer-events-none
          ${
            isDarkTheme
              ? "bg-[radial-gradient(circle,_rgba(79,70,229,0.45)_0%,_transparent_70%)]"
              : "bg-[radial-gradient(circle,_rgba(79,70,229,0.18)_0%,_transparent_70%)]"
          }
        `}
      />

      <div
        className={`
          max-w-7xl mx-auto relative z-10 
          grid grid-cols-1 lg:grid-cols-2 gap-16 items-center
        `}
      >
        {/* ЛЕВАЯ КОЛОНКА — ТЕКСТ */}
        <div>
          <motion.h1
            style={{ opacity: textOpacity, y: textY }}
            transition={{ duration: 0.8 }}
            className={`text-5xl md:text-6xl font-semibold leading-tight mb-10
              ${isDarkTheme ? "text-white" : "text-gray-900"}
            `}
          >
            Ваш ИИ-юрист, который не спит.
            <span
              className={`block mt-5 ${
                isDarkTheme ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Автоматизируйте рутину — фокусируйтесь на стратегии.
            </span>
          </motion.h1>

          {/* CTA кнопка */}
          <motion.button
            ref={tiltRef}
            onMouseMove={handleMove}
            onMouseLeave={resetTilt}
            style={{
              rotateX,
              rotateY,
              transformPerspective: 900,
            }}
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onClick={onDemoClick}
            className="
              relative px-12 py-5 text-xl rounded-xl font-semibold
              bg-[#4F46E5] text-white shadow-2xl hover:bg-[#4338CA]
              transition-all duration-300 overflow-hidden
            "
          >
            Забронировать демо

            {/* LIGHT SWEEP */}
            <motion.span
              initial={{ x: "-130%" }}
              animate={{ x: "230%" }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
                delay: 1,
              }}
              className="
                absolute top-0 h-full w-1/4 
                bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]
                opacity-70 blur-lg
              "
            />

            {/* BREATHING GLOW */}
            <motion.span
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: 0.85, scale: 1.15 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
              className="
                absolute inset-0 -z-20 rounded-xl
                bg-[radial-gradient(circle,_rgba(124,58,237,0.55)_0%,_transparent_75%)]
                blur-2xl
              "
            />

            {/* PULSING AURA */}
            <motion.span
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ opacity: 0.6, scale: 1.25 }}
              transition={{
                duration: 2.5,
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
              initial={{ opacity: 0.6 }}
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

        {/* ПРАВАЯ КОЛОНКА — ДЕКОРАТИВНЫЙ ГРАДИЕНТ (как на макете) */}
        {isDarkTheme && (
          <div className="hidden lg:flex justify-center">
            <div
              className="
                w-full h-80 rounded-3xl border border-gray-800 
                bg-gradient-to-br from-indigo-500/40 via-purple-600/30 to-pink-600/20
                shadow-[0_0_80px_rgba(79,70,229,0.35)]
              "
            />
          </div>
        )}
      </div>
    </section>
  );
}
