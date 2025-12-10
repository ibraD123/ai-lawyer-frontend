import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface PricingProps {
  isDarkTheme: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Light",
    price: "1 500 ₽/мес",
    subtitle: "Для ознакомления",
    features: [
      "До 20 генераций/анализов в месяц",
      "Базовые шаблоны документов",
      "Поддержка по email",
    ],
    cta: "Попробовать",
  },
  {
    name: "Pro",
    price: "15 000 ₽/мес",
    subtitle: "Для малого бизнеса и юристов",
    recommended: true,
    features: [
      "Безлимитная генерация и анализ",
      "Расширенная библиотека шаблонов и клауз",
      "Приоритетная поддержка в чате",
      "История и сохранение проектов (до 1 года)",
    ],
    cta: "Купить",
  },
  {
    name: "Enterprise",
    price: "$1 000/мес",
    subtitle: "Для среднего бизнеса и корпораций",
    features: [
      "Всё из тарифа Pro +",
      "Выделенный ИИ-агент (ускорение и кастомизация)",
      "White-label интерфейс и API-доступ",
      "Персональный менеджер и SLA 24/7",
      "Расширенная аналитика и аудит-логи",
      "Обучение модели на внутренних документах",
    ],
    cta: "Контакты отдела продаж",
  },
];

export function Pricing({ isDarkTheme }: PricingProps) {
  return (
    <section
      id="pricing"
      className={`py-28 px-6 ${
        isDarkTheme ? "bg-[#0F0F0F]" : "bg-white"
      } transition-colors`}
    >
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`text-5xl font-semibold text-center mb-20 ${
          isDarkTheme ? "text-white" : "text-gray-900"
        }`}
      >
        Тарифы
      </motion.h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {tiers.map((tier) => {
          const isRec = tier.recommended;

          return (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                boxShadow: isRec
                  ? "0 0 45px rgba(79,70,229,0.45)"
                  : "0 0 25px rgba(0,0,0,0.15)",
              }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className={`
                relative p-10 rounded-2xl border transition-all
                ${
                  isRec
                    ? "border-[#4F46E5] bg-white/95 shadow-xl"
                    : isDarkTheme
                    ? "border-gray-800 bg-[#1A1A1A]"
                    : "border-gray-200 bg-white"
                }
              `}
            >
              {isRec && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    absolute -top-4 left-1/2 -translate-x-1/2 
                    px-4 py-1 text-sm rounded-full
                    bg-[#4F46E5] text-white shadow-lg
                  "
                >
                  Рекомендуем
                </motion.div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-3xl font-semibold mb-2 ${
                    isDarkTheme ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tier.name}
                </h3>

                <p
                  className={`${
                    isDarkTheme ? "text-gray-400" : "text-gray-600"
                  } mb-4`}
                >
                  {tier.subtitle}
                </p>

                <div
                  className={`text-4xl font-semibold ${
                    isDarkTheme ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tier.price}
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-start gap-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="flex-shrink-0"
                    >
                      <Check className="w-6 h-6 text-[#4F46E5]" />
                    </motion.div>
                    <span
                      className={`${
                        isDarkTheme ? "text-gray-300" : "text-gray-700"
                      } text-lg`}
                    >
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`
                  w-full py-4 rounded-xl text-lg font-medium transition-colors
                  ${
                    isRec
                      ? "bg-[#4F46E5] text-white hover:bg-[#4338CA]"
                      : isDarkTheme
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }
                `}
              >
                {tier.cta}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
