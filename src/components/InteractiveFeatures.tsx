import { useState, useEffect } from "react";
import { Bot, FileText, Mic, FileCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveFeaturesProps {
  isDarkTheme: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: any;
  image: string;
}

const featureList: Feature[] = [
  {
    id: "assistant",
  title: "Юрист Ассистент",
  description:
    "ИИ-консультант отвечает на юридические вопросы, даёт рекомендации по действиям и помогает ориентироваться в законодательстве. Работает 24/7.",
  icon: Bot,
  image: "https://i.ibb.co/CK2Vp99n/image.jpg",
},
{
  id: "contract",
  title: "Анализ договоров",
  description:
    "ИИ-агент проверяет контракты, выделяет риски, предлагает правки и ведёт переговоры по стандартным пунктам. Полный цикл без вашего участия.",
  icon: FileCheck,
  image: "https://i.ibb.co/4HF3fgZ/image.jpg",
},
{
  id: "transcription",
  title: "Транскрибация аудио",
  description:
    "Автоматическая расшифровка встреч, судебных заседаний и консультаций. Выделение ключевых моментов и создание структурированных отчётов.",
  icon: Mic,
  image: "https://i.ibb.co/39hzgyWH/image.jpg",
},
{
  id: "generator",
  title: "Генератор документов",
  description:
    "Создание юридических документов по шаблонам с автоматическим заполнением данных. Претензии, договоры, дополнительные соглашения — всё готово за минуты.",
  icon: FileText,
  image: "https://i.ibb.co/8RrwRHn/image.jpg",
},
];

export function InteractiveFeatures({ isDarkTheme }: InteractiveFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState(featureList[0]);

  return (
    <section
      className={`py-28 px-6 ${
        isDarkTheme ? "bg-[#111]" : "bg-[#F5F6F7]"
      } transition-colors`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id + "-text"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mb-10"
            >
              <h2
                className={`${
                  isDarkTheme ? "text-white" : "text-gray-900"
                } text-4xl font-semibold mb-6`}
              >
                {activeFeature.title}
              </h2>

              <p
                className={`${
                  isDarkTheme ? "text-gray-300" : "text-gray-700"
                } text-xl max-w-2xl leading-relaxed`}
              >
                {activeFeature.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* КАРТИНКА */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id + "-img"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`rounded-2xl overflow-hidden shadow-lg ${
                isDarkTheme ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <img
                src={activeFeature.image}
                alt={activeFeature.title}
                className="w-full h-[420px] object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ПРАВАЯ КОЛОНКА — ВКЛАДКИ */}
        <div className="flex flex-col space-y-4 w-[90%] lg:w-[380px] ml-auto">
          {featureList.map((feature) => {
            const Icon = feature.icon;
            const active = feature.id === activeFeature.id;

            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className={`
                  flex items-center gap-5 px-6 py-5 rounded-xl border w-full text-left
                  ${
                    active
                      ? "border-[#4F46E5] bg-white shadow-sm"
                      : isDarkTheme
                      ? "border-gray-700 bg-[#1A1A1A] hover:border-gray-500"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }
                `}
              >
                <div
                  className={`
                    p-3 rounded-lg flex-shrink-0
                    ${
                      active
                        ? "bg-[#4F46E5]"
                        : isDarkTheme
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5 h-5
                      ${
                        active
                          ? "text-white"
                          : isDarkTheme
                          ? "text-gray-400"
                          : "text-gray-600"
                      }
                    `}
                  />
                </div>

                <span
                  className={`
                    text-lg font-medium
                    ${
                      active
                        ? "text-[#4F46E5]"
                        : isDarkTheme
                        ? "text-gray-200"
                        : "text-gray-700"
                    }
                  `}
                >
                  {feature.title}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
