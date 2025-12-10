import { useEffect, useRef, useState } from 'react';
import { Bot, FileText, Mic, FileCheck, Search, Shield, FileSearch, Languages, Clock, AlertTriangle, Scale, Sparkles, Sun, Moon, User } from 'lucide-react';

interface FeaturesPageProps {
  onNavigateHome: () => void;
  onLoginClick: () => void;
  onDemoClick: () => void;
  highlightedFeature: string | null;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

interface Service {
  id: string;
  icon: any;
  title: string;
  description: string;
  benefits: string[];
}

const services: Service[] = [
  {
    id: 'assistant',
    icon: Bot,
    title: 'Юрист Ассистент',
    description: 'ИИ-консультант, который отвечает на юридические вопросы в режиме реального времени',
    benefits: [
      'Мгновенные ответы на правовые вопросы',
      'Рекомендации по действиям',
      'Ссылки на законодательство',
      'Работа 24/7 без выходных'
    ]
  },
  {
    id: 'contract',
    icon: FileCheck,
    title: 'Анализ договоров',
    description: 'Автоматическая проверка контрактов на риски и несоответствия',
    benefits: [
      'Выявление рисковых пунктов',
      'Предложения по правкам',
      'Сравнение с эталонными шаблонами',
      'Проверка на соответствие законодательству'
    ]
  },
  {
    id: 'extraction',
    icon: FileSearch,
    title: 'Извлечение данных',
    description: 'Автоматическое извлечение структурированной информации из документов',
    benefits: [
      'Извлечение реквизитов и дат',
      'Определение сторон сделки',
      'Выделение финансовых условий',
      'Экспорт в структурированные форматы'
    ]
  },
  {
    id: 'generator',
    icon: FileText,
    title: 'Генератор документов',
    description: 'Создание юридических документов по готовым шаблонам',
    benefits: [
      'Библиотека из 200+ шаблонов',
      'Автоматическое заполнение данных',
      'Соответствие актуальному законодательству',
      'Экспорт в Word и PDF'
    ]
  },
  {
    id: 'transcription',
    icon: Mic,
    title: 'Транскрибация аудио',
    description: 'Расшифровка аудиозаписей встреч и консультаций',
    benefits: [
      'Высокая точность распознавания',
      'Выделение ключевых моментов',
      'Разделение по спикерам',
      'Создание структурированных отчётов'
    ]
  },
  {
    id: 'qa',
    icon: Search,
    title: 'Ответы на вопросы',
    description: 'Интеллектуальный поиск ответов в базе документов и законодательстве',
    benefits: [
      'Поиск по контексту, а не по ключевым словам',
      'Анализ релевантности результатов',
      'Цитаты с указанием источников',
      'История запросов и ответов'
    ]
  },
  {
    id: 'compliance',
    icon: Shield,
    title: 'Проверка на соответствие',
    description: 'Контроль соответствия документов нормативным требованиям',
    benefits: [
      'Проверка по актуальным стандартам',
      'Выявление несоответствий',
      'Рекомендации по исправлению',
      'Отчёты для аудита'
    ]
  },
  {
    id: 'summary',
    icon: Clock,
    title: 'Краткая выжимка',
    description: 'TL;DR любого документа — основные положения в сжатом виде',
    benefits: [
      'Экономия времени на изучении документов',
      'Выделение ключевых условий',
      'Важные даты и сроки',
      'Финансовые условия'
    ]
  },
  {
    id: 'risks',
    icon: AlertTriangle,
    title: 'Проверка рисков',
    description: 'Выявление потенциальных угроз и слабых мест в документах',
    benefits: [
      'Анализ рисковых формулировок',
      'Оценка степени риска',
      'Рекомендации по минимизации',
      'Сравнение с рыночной практикой'
    ]
  },
  {
    id: 'translation',
    icon: Languages,
    title: 'Перевод + анализ',
    description: 'Перевод юридических документов с сохранением терминологии',
    benefits: [
      'Точный перевод юридической лексики',
      'Сохранение структуры документа',
      'Одновременный анализ содержания',
      'Поддержка 15+ языков'
    ]
  }
];

export function FeaturesPage({ onNavigateHome, onLoginClick, onDemoClick, highlightedFeature, isDarkTheme, onToggleTheme }: FeaturesPageProps) {
  const serviceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [animatedFeature, setAnimatedFeature] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedFeature && serviceRefs.current[highlightedFeature]) {
      // Scroll to the highlighted feature
      setTimeout(() => {
        serviceRefs.current[highlightedFeature]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        // Trigger highlight animation
        setAnimatedFeature(highlightedFeature);
        setTimeout(() => setAnimatedFeature(null), 2000);
      }, 100);
    }
  }, [highlightedFeature]);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkTheme ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-xl tracking-tight">
            <div className="relative">
              <Scale className="w-6 h-6 text-[#4F46E5]" />
              <Sparkles className="w-3 h-3 text-[#818CF8] absolute -top-1 -right-1" />
            </div>
            <span className="text-[#4F46E5]">Юрист</span>
            <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>ИИ</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-label="Переключить тему"
            >
              {isDarkTheme ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
            <button 
              onClick={onLoginClick}
              className={`p-2 rounded-lg transition-colors ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <User className={`w-5 h-5 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
            <button 
              onClick={onDemoClick}
              className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
            >
              Забронировать демо
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className={`text-6xl mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Все возможности
            </h1>
            <p className={`text-xl ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              Полный каталог инструментов для автоматизации юридической работы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              const isHighlighted = animatedFeature === service.id;
              
              return (
                <div 
                  key={service.id}
                  ref={(el) => { serviceRefs.current[service.id] = el; }}
                  className={`
                    p-8 rounded-2xl border transition-all
                    ${isHighlighted 
                      ? 'border-[#4F46E5] shadow-2xl scale-105 ring-4 ring-[#4F46E5]/20' 
                      : `${isDarkTheme ? 'border-gray-800 hover:border-[#4F46E5]' : 'border-gray-200 hover:border-[#4F46E5]'} hover:shadow-lg`
                    }
                    ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}
                  `}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkTheme ? 'bg-[#4F46E5]/20' : 'bg-[#4F46E5]/10'}`}>
                      <Icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h3 className={`text-2xl mb-2 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                        {service.title}
                      </h3>
                      <p className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className={`flex items-start gap-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-[#4F46E5] mt-1">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={onNavigateHome}
              className="px-8 py-4 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}