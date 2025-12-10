import { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  isDarkTheme: boolean;
}

export function AuthModal({ onClose, onLogin, isDarkTheme }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl max-w-md w-full p-8 relative ${isDarkTheme ? 'bg-gray-900' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className={`text-3xl mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Вход в систему
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent ${isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}