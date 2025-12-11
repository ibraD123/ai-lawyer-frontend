import { useState } from "react";
import { ChevronDown, User, Sun, Moon } from "lucide-react";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "../hooks/useScrollDirection";

interface HeaderProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
  onNavigateHome: () => void;
  onNavigateToFeatures: (featureId?: string) => void;
  onNavigateToSecurity: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

export function Header({
  onLoginClick,
  onDemoClick,
  onNavigateHome,
  onNavigateToFeatures,
  onNavigateToSecurity,
  isDarkTheme,
  onToggleTheme,
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const scrollDir = useScrollDirection();

  const features = [
    { id: "assistant", name: "Юрист Ассистент" },
    { id: "contract", name: "Анализ договора" },
    { id: "extraction", name: "Извлечение данных" },
    { id: "generator", name: "Генератор документов" },
    { id: "transcription", name: "Транскрибация аудио" },
    { id: "qa", name: "Ответы на вопросы" },
    { id: "compliance", name: "Проверка на соответствие" },
    { id: "summary", name: "Краткая выжимка" },
    { id: "risks", name: "Проверка рисков" },
    { id: "translation", name: "Перевод + анализ" },
  ];

  const scrollToPricing = () => {
    const el = document.getElementById("pricing");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: scrollDir === "down" ? -100 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`
        fixed top-0 left-0 right-0 z-50 
        backdrop-blur-xl border-b
        ${
          isDarkTheme
            ? "bg-black/60 border-gray-800"
            : "bg-white/70 border-gray-200"
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Премиальный логотип */}
        <button
          onClick={onNavigateHome}
          className="font-semibold tracking-wider select-none hover:opacity-80 transition text-4xl"
        >
          <span className={isDarkTheme ? "text-white" : "text-gray-900"}>
            DEXLEY
          </span>
        </button>

        {/* Меню */}
        <nav className="hidden md:flex items-center gap-10">

          {/* === Возможности === */}
          <div
            className="relative group"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button
              className={`
                relative pb-1 flex items-center gap-1 font-medium
                ${isDarkTheme ? "text-gray-200" : "text-gray-800"}
                transition
              `}
              onClick={() => onNavigateToFeatures()}
            >
              Возможности
              <ChevronDown className="w-4 h-4" />
              <span
                className={`
                  absolute left-0 -bottom-0.5 h-[2px] w-0 bg-indigo-500 transition-all duration-300 
                  group-hover:w-full
                `}
              />
            </button>

            {/* Выпадающее меню */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 pt-3 w-64 z-50"
                >
                  <div
                    className={`
                      border shadow-lg rounded-lg py-2
                      ${isDarkTheme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
                    `}
                  >
                    {features.map((feature) => (
                      <button
                        key={feature.id}
                        onClick={() => {
                          onNavigateToFeatures(feature.id);
                          setShowDropdown(false);
                        }}
                        className={`
                          block w-full text-left px-4 py-2 text-sm transition-colors font-medium
                          ${
                            isDarkTheme
                              ? "text-gray-200 hover:bg-gray-800"
                              : "text-gray-700 hover:bg-gray-100"
                          }
                        `}
                      >
                        {feature.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* === Тарифы === */}
          <button
            onClick={scrollToPricing}
            className={`
              relative pb-1 font-medium transition
              ${isDarkTheme ? "text-gray-200" : "text-gray-800"}
              group
            `}
          >
            Тарифы
            <span
              className="
                absolute left-0 -bottom-0.5 h-[2px] w-0 bg-indigo-500 
                transition-all duration-300 group-hover:w-full
              "
            />
          </button>

          {/* === Безопасность === */}
          <button
            onClick={onNavigateToSecurity}
            className={`
              relative pb-1 font-medium transition
              ${isDarkTheme ? "text-gray-200" : "text-gray-800"}
              group
            `}
          >
            Безопасность
            <span
              className="
                absolute left-0 -bottom-0.5 h-[2px] w-0 bg-indigo-500 
                transition-all duration-300 group-hover:w-full
              "
            />
          </button>
        </nav>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          {/* Тема */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition ${
              isDarkTheme ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            {isDarkTheme ? (
              <Sun className="w-5 h-5 text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* ЛК */}
          <button
            onClick={onLoginClick}
            className={`p-2 rounded-lg transition ${
              isDarkTheme ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <User
              className={`w-5 h-5 ${
                isDarkTheme ? "text-gray-200" : "text-gray-700"
              }`}
            />
          </button>

          {/* Демо */}
          <Button
            onClick={onDemoClick}
            className="px-8 py-3 rounded-xl text-base bg-[#4F46E5] hover:bg-[#4338CA]"
          >
            Забронировать демо
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
