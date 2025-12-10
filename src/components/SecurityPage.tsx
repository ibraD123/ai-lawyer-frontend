import { useState } from 'react';
import { Shield, Lock, FileCheck, Server, Eye, Award, Scale, Sparkles, Sun, Moon, User } from 'lucide-react';
import { ContactForm } from './ContactForm';

interface SecurityPageProps {
  onNavigateHome: () => void;
  onLoginClick: () => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

const securityFeatures = [
  {
    icon: Lock,
    title: 'Шифрование данных',
    description: 'Все данные шифруются end-to-end с использованием AES-256. Ваши документы защищены как при передаче, так и при хранении.'
  },
  {
    icon: Server,
    title: 'Изолированное хранилище',
    description: 'Данные каждого клиента хранятся в изолированной среде. Мы используем технологии контейнеризации для максимальной безопасности.'
  },
  {
    icon: Eye,
    title: 'Конфиденциальность',
    description: 'Мы не используем ваши данные для обучения общедоступных моделей. Информация клиентов остаётся строго конфиденциальной.'
  },
  {
    icon: FileCheck,
    title: 'Соответствие стандартам',
    description: 'Платформа соответствует требованиям GDPR и российского законодательства о персональных данных.'
  },
  {
    icon: Shield,
    title: 'Регулярные аудиты',
    description: 'Мы проводим регулярные проверки безопасности и тестирования на проникновение с привлечением независимых экспертов.'
  },
  {
    icon: Award,
    title: 'SLA гарантии',
    description: 'Для Enterprise-клиентов предоставляем SLA с гарантией доступности 99.9% и круглосуточной поддержкой.'
  }
];

export function SecurityPage({ onNavigateHome, onLoginClick, isDarkTheme, onToggleTheme }: SecurityPageProps) {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
      
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${isDarkTheme ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* LOGO */}
          <button onClick={onNavigateHome} className="flex items-center gap-2 text-xl tracking-tight">
            <div className="relative">
              <Scale className="w-6 h-6 text-indigo-500" />
              <Sparkles className="w-3 h-3 text-indigo-300 absolute -top-1 -right-1" />
            </div>
            <span className="text-indigo-500">Юрист</span>
            <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>ИИ</span>
          </button>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <button 
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              {isDarkTheme ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button 
              onClick={onLoginClick}
              className={`p-2 rounded-lg transition ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <User className={`w-5 h-5 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className={`text-6xl font-semibold mb-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Безопасность и надежность
            </h1>
            <p className={`text-xl ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              Мы понимаем важность конфиденциальности юридической информации. Безопасность ваших данных — наш главный приоритет.
            </p>
          </div>

          {/* FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`p-6 rounded-2xl border transition-colors ${
                    isDarkTheme ? 'border-gray-800 hover:border-gray-700 bg-gray-900' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${isDarkTheme ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`}>
                    <Icon className="w-6 h-6 text-indigo-500" />
                  </div>
                  <h3 className={`text-xl mb-3 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl p-12 text-center`}>
            <h2 className={`text-3xl mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Нам можно доверять
            </h2>
            <p className={`text-xl max-w-2xl mx-auto mb-8 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
              Более 500 юридических компаний уже используют ЮристИИ. Ваши данные в безопасности.
            </p>
            <button 
              onClick={() => setShowContactForm(true)}
              className="px-8 py-4 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              Узнать больше о безопасности
            </button>
          </div>
        </div>
      </main>

      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </div>
  );
}
