import { useState } from 'react';
import { X } from 'lucide-react';

interface ContactFormProps {
  onClose: () => void;
  isDemo?: boolean;
}

export function ContactForm({ onClose, isDemo = false }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    const msg = isDemo 
      ? 'Спасибо! Мы свяжемся с вами для организации демонстрации в ближайшее время.'
      : 'Спасибо за ваше обращение! Мы свяжемся с вами в ближайшее время.';
    alert(msg);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-3xl mb-2 text-gray-900 dark:text-white">
          {isDemo ? 'Забронировать демо' : 'Свяжитесь с нами'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isDemo 
            ? 'Заполните форму и мы организуем персональную демонстрацию платформы'
            : 'Задайте вопрос о безопасности и мы ответим в ближайшее время'
          }
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Ваше имя"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              {isDemo ? 'Комментарий (необязательно)' : 'Сообщение'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder={isDemo ? 'Расскажите о вашей компании и задачах...' : 'Расскажите о вашем вопросе...'}
              required={!isDemo}
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}